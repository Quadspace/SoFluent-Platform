/**
 * Class Model
 * Live class scheduling and management
 */

import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    instructorId: { type: String, required: true }, // Clerk ID
    date: { type: Date, required: true },
    time: { type: String, required: true }, // "09:00" format
    duration: { type: Number, required: true, default: 40 }, // minutes
    maxStudents: { type: Number, required: true, default: 20 },
    enrolledStudents: [{ type: String }], // Array of user IDs
    attendedStudents: [{ type: String }], // Array of user IDs who attended
    level: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true 
    },
    type: { 
        type: String, 
        enum: ['live', 'recorded'],
        default: 'live'
    },
    description: { type: String },
    meetingLink: { type: String }, // Zoom/Google Meet link
    recordingLink: { type: String }, // Link to recording if available
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    tags: [{ type: String }], // ['fitness', 'business', 'conversation']
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } // Related course if any
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

export default Class;
