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

        // Remove lecture Url if previewFrese is false

        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if(!lecture.isPreviewFree){
                    lecture.lectureurl = "";
                }
            })
        })

        res.json({success:true, courseData})
        
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}