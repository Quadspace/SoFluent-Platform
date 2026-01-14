/**
 * Class Scheduling Controller
 * Handles live class scheduling, RSVPs, and attendance
 * Feature 2: Workout-to-Fluency™
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import { createZoomMeeting } from '../services/zoomService.js';

/**
 * GET /api/classes/upcoming
 * Get upcoming classes for student
 */
export const getUpcomingClasses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get upcoming classes from database
        const now = new Date();
        const upcomingClasses = await dbAdapter.find(Class, {
            date: { $gte: now },
            status: { $in: ['scheduled', 'in-progress'] }
        });

        // Format and filter classes
        const upcoming = upcomingClasses
            .map(cls => {
                const classDate = new Date(cls.date);
                classDate.setHours(parseInt(cls.time.split(':')[0]));
                classDate.setMinutes(parseInt(cls.time.split(':')[1]));
                
                // Check if student is enrolled
                const isEnrolled = cls.enrolledStudents?.includes(user._id.toString()) || false;
                const timeUntil = getTimeUntil(classDate);
                
                return {
                    id: cls._id.toString(),
                    title: cls.title,
                    time: formatDateTime(classDate),
                    timeUntil,
                    type: cls.type,
                    enrolled: isEnrolled,
                    instructor: cls.instructor,
                    maxStudents: cls.maxStudents,
                    enrolledCount: cls.enrolledStudents?.length || 0,
                    level: cls.level,
                    description: cls.description
                };
            })
            .sort((a, b) => {
                // Sort by date
                return new Date(a.time) - new Date(b.time);
            })
            .slice(0, 5); // Limit to 5 upcoming classes

        // If no classes in database, return mock data for preview
        if (upcoming.length === 0) {
            return res.json({
                success: true,
                classes: [
                    {
                        id: 'mock-1',
                        title: 'Fluency Fit Beginner',
                        time: 'Tomorrow 9:00 AM',
                        timeUntil: 'in 1 day',
                        type: 'live',
                        enrolled: false,
                        instructor: 'Heloisa Lott',
                        maxStudents: 20,
                        enrolledCount: 0,
                        level: 'beginner'
                    },
                    {
                        id: 'mock-2',
                        title: 'Business English Advanced',
                        time: 'Friday 6:00 PM',
                        timeUntil: 'in 3 days',
                        type: 'live',
                        enrolled: false,
                        instructor: 'Heloisa Lott',
                        maxStudents: 15,
                        enrolledCount: 0,
                        level: 'advanced'
                    }
                ]
            });
        }

        res.json({
            success: true,
            classes: upcoming
        });
    } catch (error) {
        console.error('Error fetching upcoming classes:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/classes/:id/rsvp
 * RSVP to a class
 */
export const rsvpToClass = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const classItem = await dbAdapter.findOne(Class, { _id: id });
        if (!classItem) {
            return res.json({ success: false, message: 'Class not found' });
        }

        // Check if already enrolled
        const enrolledStudents = classItem.enrolledStudents || [];
        if (enrolledStudents.includes(user._id.toString())) {
            return res.json({ success: false, message: 'Already enrolled' });
        }

        // Check if class is full
        if (enrolledStudents.length >= classItem.maxStudents) {
            return res.json({ success: false, message: 'Class is full' });
        }

        // Add student to enrolled list
        enrolledStudents.push(user._id.toString());
        await dbAdapter.updateOne(
            Class,
            { _id: id },
            { enrolledStudents }
        );

        res.json({
            success: true,
            message: 'Successfully enrolled in class'
        });
    } catch (error) {
        console.error('Error RSVPing to class:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/classes/:id/cancel
 * Cancel RSVP to a class
 */
export const cancelRsvp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const classItem = await dbAdapter.findOne(Class, { _id: id });
        if (!classItem) {
            return res.json({ success: false, message: 'Class not found' });
        }

        // Remove student from enrolled list
        const enrolledStudents = (classItem.enrolledStudents || []).filter(
            studentId => studentId !== user._id.toString()
        );
        
        await dbAdapter.updateOne(
            Class,
            { _id: id },
            { enrolledStudents }
        );

        res.json({
            success: true,
            message: 'RSVP cancelled'
        });
    } catch (error) {
        console.error('Error cancelling RSVP:', error);
        res.json({ success: false, message: error.message });
    }
};

// Helper functions
function getTimeUntil(date) {
    const now = new Date();
    const diff = date - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        const minutes = Math.floor(diff / (1000 * 60));
        return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
}

function formatDateTime(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return `Today ${displayHours}:${displayMinutes} ${ampm}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow ${displayHours}:${displayMinutes} ${ampm}`;
    } else {
        return `${dayName}, ${month} ${day} at ${displayHours}:${displayMinutes} ${ampm}`;
    }
}

/**
 * POST /api/classes/schedule
 * Schedule a new live class (admin)
 */
export const scheduleClass = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const {
            title,
            date,
            time,
            duration,
            type,
            level,
            maxStudents,
            description,
            tags
        } = req.body;

        // Create Zoom meeting
        const meetingDate = new Date(`${date}T${time}:00`);
        const zoomMeeting = await createZoomMeeting({
            topic: title,
            start_time: meetingDate.toISOString(),
            duration: duration || 45,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                waiting_room: true
            }
        });

        // Create class in database
        const liveClass = await dbAdapter.create(Class, {
            title,
            instructor: user.name,
            instructorId: userId,
            date: meetingDate,
            time,
            duration: duration || 45,
            type: type || 'live',
            level: level || 'intermediate',
            maxStudents: maxStudents || 20,
            description,
            tags: tags || [],
            meetingLink: zoomMeeting.join_url,
            zoomMeetingId: zoomMeeting.id,
            status: 'scheduled'
        });

        // Auto-create Google Meet (if Google integration enabled)
        try {
            if (user.email && process.env.GOOGLE_CLIENT_ID) {
                const googleMeetService = (await import('../services/googleMeet.js')).default;
                const enrolledStudents = liveClass.enrolledStudents || [];
                const studentEmails = await Promise.all(
                    enrolledStudents.map(async (studentId) => {
                        const student = await dbAdapter.findOne(User, { _id: studentId });
                        return student?.email;
                    })
                ).then(emails => emails.filter(Boolean));

                const meetResult = await googleMeetService.createMeeting(
                    user.email,
                    title,
                    meetingDate,
                    duration || 45,
                    studentEmails,
                    description
                );

                if (meetResult.success) {
                    // Store Google Meet link
                    liveClass.googleMeetLink = meetResult.meetLink;
                    liveClass.googleMeetId = meetResult.meetId;
                    await dbAdapter.updateOne(Class, { _id: liveClass._id }, {
                        googleMeetLink: meetResult.meetLink,
                        googleMeetId: meetResult.meetId
                    });
                }
            }
        } catch (googleError) {
            // Log but don't fail class creation if Google sync fails
            console.warn('Google Meet auto-sync failed:', googleError.message);
        }

        res.json({
            success: true,
            class: liveClass
        });
    } catch (error) {
        console.error('Error scheduling class:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getUpcomingClasses,
    rsvpToClass,
    cancelRsvp,
    scheduleClass
};
