import Stripe from "stripe"
import Course from "../models/Course.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import { CourseProgress } from "../models/CourseProgress.js"
import dbAdapter from "../configs/database-adapter.js"
import { clerkClient } from '@clerk/express'
import emailService from '../services/emailService.js'
import crypto from 'crypto'

// Get users data
export const getUserData = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const user = await dbAdapter.users.findById(userId)
        if(!user){
            return res.json({success: false, message:"User not found!"})
        }
        res.json({success: true, user});
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// User enrolled course with lecture link

export const userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const userData = await dbAdapter.users.findById(userId, {populate: 'enrolledCourses'})
        res.json({success:true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}


// Purchase course

export const purchaseCourse = async (req,res) => {
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.auth.userId;

        const userData = await dbAdapter.users.findById(userId)
        const courseData = await dbAdapter.courses.findById(courseId)
        if(!userData || !courseData)
        {
            res.json({success: false, message: "Data Not Found"})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await dbAdapter.purchases.create(purchaseData);

        // stripe gateway initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase();
        
        // creating line items to for stripe
        const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor( newPurchase.amount ) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({success: true, session_url: session.url})


    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Update user Course progress

export const updateUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId, lectureId} = req.body
        const progressData = await dbAdapter.courseProgress.findByUserAndCourse(userId, courseId)

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true, message: "Lecture Already Completed"})
            }
            
            progressData.lectureCompleted.push(lectureId)
            progressData.completed = true
            await dbAdapter.courseProgress.save(progressData)
        }
        else{
            await dbAdapter.courseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        res.json({success:true, message: 'Progress Updated'})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// get user course progress

export const getUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId} = req.body
        const progressData = await dbAdapter.courseProgress.findByUserAndCourse(userId, courseId)
        res.json({success: true, progressData})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}


// Add user ratings to course

export const addUserRating = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId, rating} = req.body

        if(!courseId || !userId || !rating || rating < 1 || rating > 5)
        {
            res.json({success: false, message:"Invalid details"})
        }

        const course = await dbAdapter.courses.findById(courseId)
        if(!course){
            return res.json({success: false, message:"Course Not found!"})
        }

        const user = await dbAdapter.users.findById(userId)

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success: false, message:"User has not purchased this course."})
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)
        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating;
        }
        else{
            course.courseRatings.push({userId,rating});
        }

        // Use adapter save method
        await dbAdapter.courses.save(course)
        res.json({success: true, message:"Rating Added"})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Request password reset
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.json({ success: false, message: 'Email is required' });
        }

        // Find user by email
        const user = await dbAdapter.users.findByEmail(email);
        
        if (!user) {
            // Don't reveal if user exists (security best practice)
            return res.json({ 
                success: true, 
                message: 'If an account exists with this email, a password reset link has been sent.' 
            });
        }

        // Generate reset token (for Clerk integration)
        // Clerk handles password reset, but we can send a notification email
        try {
            // Use Clerk's password reset API
            await clerkClient.users.createPasswordResetToken({
                userId: user.clerkId || user._id.toString()
            });

            // Send password reset email notification
            const resetToken = crypto.randomBytes(32).toString('hex');
            await emailService.sendPasswordResetEmail(user, resetToken);

            res.json({ 
                success: true, 
                message: 'Password reset instructions have been sent to your email.' 
            });
        } catch (clerkError) {
            // If Clerk user doesn't exist, still send success message (security)
            res.json({ 
                success: true, 
                message: 'If an account exists with this email, a password reset link has been sent.' 
            });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Reset password (using Clerk's reset token)
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.json({ success: false, message: 'Token and new password are required' });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Clerk handles password reset via their UI components
        // This endpoint is for API-based resets if needed
        // For now, redirect to Clerk's password reset flow
        res.json({ 
            success: false, 
            message: 'Please use the password reset link sent to your email, or use Clerk\'s password reset UI.' 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}