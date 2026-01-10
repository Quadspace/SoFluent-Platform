import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import storageAdapter from '../configs/storage-adapter.js'
import dbAdapter from '../configs/database-adapter.js'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'


// Update role to educator
export const updateRoleToEducator = async (req,res)=>{
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator',
            }
        })

        res.json({success: true, message: 'You can publish a course now'})


    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

//  Add new course 
// export const addCourse = async(req,res) =>{
//     try {
//         const {courseData} = req.body;
//         const imageFile = req.file;
//         const educatorId = req.auth.userId
//         console.log(educatoreId);
//         if(!imageFile){
//             return res.json({success: false, message:"Thumbnail Not Attached"})
//         }

//         const parsedCourseData = await JSON.parse(courseData)
//         parsedCourseData.educator = educatorId
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
//         newCourse.courseThumbnail = imageUpload.secure_url
//         const newCourse = await Course.create(parsedCourseData)
//         await newCourse.save()
//         res.json({success: true, message: "Course Added"})



//     } catch (error) {
//         res.json({success: false, message:error.message})
//     }
// }

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        // console.log(educatorId);

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail Not Attached" });
        }

        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        // Ensure 'isPublished' defaults to true
        // parsedCourseData.isPublished = parsedCourseData.isPublished ?? true;

        // Ensure all lectures have required fields
        // if (!parsedCourseData.courseContent?.every(chapter => 
        //     chapter.chapterContent?.every(lecture => lecture.lectureId && lecture.lectureurl)
        // )) {
        //     return res.json({ success: false, message: "Lecture ID and URL are required in all chapters." });
        // }

        // Upload image using storage adapter
        const imageUpload = await storageAdapter.upload(imageFile, 'courses');
        parsedCourseData.courseThumbnail = imageUpload.url;

        // Create course using database adapter
        const newCourse = await dbAdapter.courses.create(parsedCourseData);

        res.json({ success: true, message: "Course Added", course: newCourse });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};




// Get educator courses

export const getEducatorCourses = async(req,res) => {
    try {
        const educator = req.auth.userId
        const courses = await dbAdapter.courses.findByEducator(educator)
        res.json({success: true, courses})
        
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// get educatore dashboard data (ttal earnings, enrolled students, No. of courses)

export const educatorDashboardData = async(req,res) =>{
    try {
        const educator = req.auth.userId

        const courses = await dbAdapter.courses.findByEducator(educator);
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id)
        // calculate total earnings from purchases using adapter
        const purchases = await dbAdapter.purchases.findByCourseIds(courseIds, 'completed');

        const totalEarnings = Math.round(purchases.reduce((sum, purchase) => sum + purchase.amount, 0)).toFixed(2)
        
        // collect unique enrolled students ids with their course title
        const enrolledStudentsData = [];
        for(const course of courses){
            if (course.enrolledStudents && course.enrolledStudents.length > 0) {
                const students = await dbAdapter.users.findByIds(course.enrolledStudents);
                students.forEach(student => {
                    enrolledStudentsData.push({
                        courseTitle: course.courseTitle,
                        student: {
                            name: student.name,
                            imageUrl: student.imageUrl
                        }
                    });
                });
            }
        }
        res.json({success: true, dashboardData: {
            totalEarnings, enrolledStudentsData, totalCourses
        }})
    } catch (error) {
        res.json({success: false, message:error.message})    
    }
}




// Get Enrolled Students Data with purchase data

export const getEnrolledStudentsData = async(req,res) =>{
    try {
        const educator = req.auth.userId;
        const courses = await dbAdapter.courses.findByEducator(educator)
        const courseIds = courses.map(course => course._id)

        const purchases = await dbAdapter.purchases.findByCourseIds(courseIds, 'completed')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId?.courseTitle || 'Unknown Course',
            purchaseDate: purchase.createdAt
        }));

        res.json({success: true, enrolledStudents});

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Get individual student profile
export const getStudentProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const educator = req.auth.userId;

        // Get student data
        const student = await dbAdapter.users.findById(id);
        if (!student) {
            return res.json({ success: false, message: 'Student not found' });
        }

        // Get student's enrolled courses
        const purchases = await dbAdapter.purchases.findByUserId(id);
        const enrolledCourses = await Promise.all(
            purchases.map(async (purchase) => {
                const course = await dbAdapter.courses.findById(purchase.courseId);
                // Calculate progress (mock for now)
                const progress = Math.floor(Math.random() * 100);
                return {
                    title: course?.courseTitle || 'Unknown Course',
                    progress: progress,
                };
            })
        );

        // Get payment history
        const paymentHistory = purchases.map(purchase => ({
            date: purchase.createdAt.toLocaleDateString(),
            amount: `R$${purchase.amount}`,
            status: purchase.status === 'completed' ? 'Paid' : 'Pending',
        }));

        res.json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                avatar: student.imageUrl,
                plan: 'Academy Plan', // TODO: Get from subscription
                planPrice: 'R$297/mo',
                status: 'Active',
                joinedDate: student.createdAt.toLocaleDateString(),
                englishLevel: 60, // TODO: Calculate from progress
                fitnessLevel: 70, // TODO: Calculate from workouts
                attendance: { attended: 18, total: 20 }, // TODO: Calculate from classes
                streak: 12, // TODO: Calculate from activity
                totalHours: 36.5, // TODO: Calculate from course time
                enrolledCourses,
                payments: paymentHistory,
                notes: [], // TODO: Add notes system
            },
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get payments and billing data
export const getPayments = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await dbAdapter.courses.findByEducator(educator);
        const courseIds = courses.map(course => course._id);

        const purchases = await dbAdapter.purchases.findByCourseIds(courseIds);
        
        // Format payments
        const payments = await Promise.all(
            purchases.slice(0, 50).map(async (purchase) => {
                const user = await dbAdapter.users.findById(purchase.userId);
                return {
                    id: purchase._id,
                    student: user?.name || 'Unknown',
                    amount: purchase.amount,
                    plan: purchase.amount >= 900 ? 'VIP' : 'Academy',
                    date: purchase.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    status: purchase.status === 'completed' ? 'success' : 'failed',
                };
            })
        );

        // Get failed payments
        const failedPayments = payments.filter(p => p.status === 'failed').map(p => ({
            ...p,
            reason: 'Card Declined', // TODO: Get actual reason
        }));

        // Calculate stats
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const thisMonthPayments = purchases.filter(p => new Date(p.createdAt) >= thisMonth);
        const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        const thisYear = new Date();
        thisYear.setMonth(0, 1);
        const thisYearPayments = purchases.filter(p => new Date(p.createdAt) >= thisYear);
        const thisYearRevenue = thisYearPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        const successRate = purchases.length > 0
            ? Math.round((purchases.filter(p => p.status === 'completed').length / purchases.length) * 100 * 10) / 10
            : 100;

        res.json({
            success: true,
            payments,
            failedPayments,
            stats: {
                thisMonth: Math.round(thisMonthRevenue),
                thisYear: Math.round(thisYearRevenue),
                activeSubs: purchases.length,
                successRate,
            },
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await dbAdapter.courses.findByEducator(educator);
        const courseIds = courses.map(course => course._id);
        const purchases = await dbAdapter.purchases.findByCourseIds(courseIds);

        // Get unique students
        const uniqueStudentIds = [...new Set(purchases.map(p => p.userId))];
        const totalStudents = uniqueStudentIds.length;
        const activeStudents = Math.floor(totalStudents * 0.9); // Mock: 90% active

        // Calculate course performance
        const coursePerformance = await Promise.all(
            courses.map(async (course) => {
                const coursePurchases = purchases.filter(p => p.courseId === course._id);
                const completionRate = Math.floor(Math.random() * 50) + 50; // Mock: 50-100%
                return {
                    title: course.courseTitle,
                    students: coursePurchases.length,
                    rating: course.courseRatings?.length > 0
                        ? course.courseRatings.reduce((sum, r) => sum + r.rating, 0) / course.courseRatings.length
                        : 4.5,
                    completionRate,
                };
            })
        );

        // Calculate revenue metrics
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const thisMonthPayments = purchases.filter(p => new Date(p.createdAt) >= thisMonth);
        const mrr = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const arpu = totalStudents > 0 ? Math.round(mrr / totalStudents) : 0;

        res.json({
            success: true,
            analytics: {
                engagement: {
                    activeStudents,
                    totalStudents,
                    avgClassesPerWeek: 2.8,
                    avgHomeworkCompletion: 78,
                    avgTimeSpent: 4.2,
                    topPerformers: [], // TODO: Calculate from activity
                    atRisk: [], // TODO: Calculate from inactivity
                },
                courses: {
                    mostPopular: coursePerformance
                        .sort((a, b) => b.students - a.students)
                        .slice(0, 3),
                    highestCompletion: coursePerformance
                        .sort((a, b) => b.completionRate - a.completionRate)
                        .slice(0, 3),
                    needsImprovement: coursePerformance
                        .filter(c => c.completionRate < 50)
                        .slice(0, 3),
                },
                revenue: {
                    mrr: Math.round(mrr),
                    growthRate: 12,
                    churnRate: 3.2,
                    arpu,
                    funnel: {
                        visitors: 2450,
                        trialSignups: 87,
                        paidConversions: totalStudents,
                    },
                },
            },
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};