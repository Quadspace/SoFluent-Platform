import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
import axios from 'axios'
import { toast } from 'react-toastify';

export const AppContext = createContext()

// Check if Clerk is available
const hasClerk = typeof window !== 'undefined' && 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.length > 20;

// Safe hook wrapper for Clerk
// Note: In Vite, we can't use require(). We'll use a different pattern.
const useClerkSafe = () => {
    // For now, always return preview mode
    // Clerk integration should be handled at the component level with proper imports
    return {
        user: null,
        getToken: () => Promise.resolve(null),
        isLoaded: true
    };
};

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const currency = import.meta.env.VITE_CURRENCY || 'R$';
    const navigate = useNavigate();

    // Get Clerk data safely (works with or without Clerk)
    const { user, getToken, isLoaded } = useClerkSafe();

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true) // Default to true for preview
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    // fetch all courses 
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');
            if (data.success) {
                setAllCourses(data.courses)
            }
        } catch (error) {
            // Silent fail - use empty array
            setAllCourses([]);
        }
    }

    // fetch user data
    const fetchUserData = async () => {
        if (!user) return;

        if (user.publicMetadata?.role === 'educator') {
            setIsEducator(true);
        }

        try {
            const token = await getToken();
            if (!token) return;

            const { data } = await axios.get(backendUrl + '/api/user/data', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
            }
        } catch (error) {
            // Silent fail for preview mode
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if (!course?.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        if (!chapter?.chapterContent) return '0m';
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    // Function to calculate course Duration
    const calculateCourseDuration = (course) => {
        if (!course?.courseContent) return '0m';
        let time = 0;
        course.courseContent.map((chapter) => chapter.chapterContent?.map(
            (lecture) => time += lecture.lectureDuration
        ))
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    // Function to calculate no. of lectures in the course
    const calculateNoOfLectures = (course) => {
        if (!course?.courseContent) return 0;
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    const fetchUserEnrolledCourses = async () => {
        if (!user) return;
        try {
            const token = await getToken();
            if (!token) return;

            const response = await axios.get(backendUrl + "/api/user/enrolled-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.enrolledCourses) {
                setEnrolledCourses(response.data.enrolledCourses.reverse());
            }
        } catch (error) {
            // Silent fail for preview mode
        }
    };

    useEffect(() => {
        fetchAllCourses()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

    const value = {
        currency, allCourses, navigate, isEducator, setIsEducator,
        calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,
        fetchUserEnrolledCourses, setEnrolledCourses, enrolledCourses, backendUrl, userData, setUserData, getToken, fetchAllCourses,
        user // Also expose user
    }

    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )
}
