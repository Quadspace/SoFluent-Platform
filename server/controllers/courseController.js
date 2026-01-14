import dbAdapter from "../configs/database-adapter.js";

// get all courses

export const getAllCourse = async (req,res) => {
    try {
        const courses = await dbAdapter.courses.findAll(
            {isPublished: true},
            {
                select: ['-courseContent','-enrolledStudents'],
                populate: {path: 'educator'}
            }
        )
        
        

        res.json ({success: true, courses})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}


// get course by id

export const getCourseId = async(req,res)=>{
    const {id} = req.params 
    try {
        const courseData = await dbAdapter.courses.findById(id, {populate: {path:'educator'}});

        if (!courseData) {
            return res.status(404).json({success: false, message: 'Course not found'});
        }

        // Remove lecture Url if previewFree is false
        if (courseData.courseContent && Array.isArray(courseData.courseContent)) {
            courseData.courseContent.forEach(chapter => {
                if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
                    chapter.chapterContent.forEach(lecture => {
                        if(!lecture.isPreviewFree){
                            lecture.lectureurl = "";
                        }
                    });
                }
            });
        }

        res.json({success:true, courseData})
        
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({success: false, message: error.message || 'Failed to fetch course'})
    }
}