/**
 * Teacher Admin Controller
 * 3-Tier Platform: Level 2 - Teacher operations
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import Teacher from '../models/Teacher.js';
import Cohort from '../models/Cohort.js';
import Class from '../models/Class.js';

/**
 * GET /api/teacher/dashboard
 * Get Teacher Admin dashboard
 */
export const getTeacherDashboard = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        
        // Get teacher record
        const teacher = await dbAdapter.findOne(Teacher, { userId });
        
        if (!teacher) {
            return res.json({ success: false, message: 'Teacher record not found' });
        }
        
        // Get assigned students
        const students = await dbAdapter.find(User, {
            _id: { $in: teacher.assignedStudents || [] }
        });
        
        // Get assigned cohorts
        const cohorts = await dbAdapter.find(Cohort, {
            _id: { $in: teacher.assignedCohorts || [] }
        });
        
        // Get upcoming classes
        const now = new Date();
        const upcomingClasses = await dbAdapter.find(Class, {
            instructorId: userId,
            date: { $gte: now },
            status: { $in: ['scheduled', 'in-progress'] }
        }, {
            sort: { date: 1 },
            limit: 5
        });
        
        // Calculate earnings (this month)
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const monthlyEarning = teacher.earnings?.monthlyEarnings?.find(e => e.month === thisMonth);
        const thisMonthEarnings = monthlyEarning?.amount || 0;
        
        res.json({
            success: true,
            dashboard: {
                metrics: {
                    students: students.length,
                    activeStudents: students.filter(s => s.onboardingCompleted).length,
                    classes: upcomingClasses.length,
                    earnings: thisMonthEarnings,
                    averageRating: teacher.performance?.averageRating || 0,
                    attendance: 92 // TODO: Calculate from class attendance
                },
                upcomingClasses,
                cohorts: cohorts.map(c => ({
                    _id: c._id,
                    name: c.name,
                    status: c.status,
                    studentCount: c.capacity?.current || 0
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching teacher dashboard:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/teacher/students
 * Get teacher's assigned students
 */
export const getTeacherStudents = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const teacher = await dbAdapter.findOne(Teacher, { userId });
        
        if (!teacher) {
            return res.json({ success: false, message: 'Teacher record not found' });
        }
        
        const students = await dbAdapter.find(User, {
            _id: { $in: teacher.assignedStudents || [] }
        });
        
        // Get student progress
        const studentsWithProgress = await Promise.all(students.map(async (student) => {
            const cohorts = await dbAdapter.find(Cohort, {
                students: student._id,
                teacherId: userId
            });
            
            // Calculate progress (simplified)
            const progress = student.onboardingCompleted ? 87 : 45;
            const attendance = 18; // TODO: Calculate from class attendance
            
            return {
                ...student.toObject(),
                progress,
                attendance: `${attendance}/20`,
                cohorts: cohorts.map(c => c.name),
                atRisk: progress < 50 || attendance < 14
            };
        }));
        
        res.json({
            success: true,
            students: studentsWithProgress
        });
    } catch (error) {
        console.error('Error fetching teacher students:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/teacher/earnings
 * Get teacher's earnings (limited view)
 */
export const getTeacherEarnings = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const teacher = await dbAdapter.findOne(Teacher, { userId });
        
        if (!teacher) {
            return res.json({ success: false, message: 'Teacher record not found' });
        }
        
        res.json({
            success: true,
            earnings: {
                totalEarned: teacher.earnings?.totalEarned || 0,
                monthlyEarnings: teacher.earnings?.monthlyEarnings || [],
                commissionRate: teacher.earnings?.commissionRate || 0.30,
                thisMonth: teacher.earnings?.monthlyEarnings?.slice(-1)[0]?.amount || 0
            }
        });
    } catch (error) {
        console.error('Error fetching teacher earnings:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getTeacherDashboard,
    getTeacherStudents,
    getTeacherEarnings
};
