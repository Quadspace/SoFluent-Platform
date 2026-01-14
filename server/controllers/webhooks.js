// import { Webhook } from "svix";
// import User from "../models/User.js";

// // Api controller function to manage clerk user with databse

// export const clerkWebhooks = async (req,res)=>{

//     try {
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
//         await whook.verify(JSON.stringify(req.body),{
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         })

//         const {data, type} = req.body

//         switch (type) {
//             case 'user.created':{
//                 const userData = {
//                     _id: data.id,
//                     email:data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     imageUrl: data.image_url,
//                 }
//                 await User.create(userData)
//                 res.json({})
//                 break;
//             }
                
//                 case 'user.updated':{
//                     const userData = {
//                         email:data.email_address[0].email_address,
//                         name: data.first_name + " " + data.last_name,
//                         imageUrl: data.image_url,
//                     }
//                     await User.findByIdAndUpdate(data.id, userData)
//                     res.json({})
//                     break;
//                 }

//                 case 'user.deleted': {
//                     await User.findByIdAndDelete(data.id);
//                     res.json({})
//                     break;
//                 }
        
//             default:
//                 break;
//         }

//     } catch (error) {
//         res.json({success: false, message: error.message})
//     }

// }

import { Webhook } from "svix";
import dbAdapter from "../configs/database-adapter.js";
import Stripe from "stripe";
import { request, response } from "express";
import emailService from "../services/emailService.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body); // Use req.rawBody if available

        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                // Get role from Clerk metadata (if set)
                const role = data.public_metadata?.role || 'student';
                const userData = {
                    _id: data.id,
                    clerkId: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                    role: role // Assign role from Clerk metadata
                };
                // Use database adapter
                const newUser = await dbAdapter.users.create(userData);
                
                // Handle referral if referral code was used
                const referralCode = data.public_metadata?.referralCode || data.unsafe_metadata?.referralCode;
                if (referralCode) {
                    try {
                        const referralRewardService = (await import('../services/referralRewardService.js')).default;
                        await referralRewardService.handleRefereeSignUp(newUser._id, referralCode);
                    } catch (refError) {
                        // Don't fail user creation if referral processing fails
                    }
                }
                
                // Send welcome email
                try {
                    await emailService.sendWelcomeEmail({
                        email: userData.email,
                        fullName: userData.name,
                    });
                } catch (emailError) {
                    // Don't fail user creation if email fails
                }
                
                return res.json({ success: true });
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                };
                // Use database adapter
                await dbAdapter.users.update(data.id, userData);
                return res.json({ success: true });
            }

            case 'user.deleted': {
                // Use database adapter
                await dbAdapter.users.delete(data.id);
                return res.json({ success: true });
            }

            default:
                return res.status(400).json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);


// export const stripeWebhooks = async (request,response) => {
//     const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   }
//   catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//   }
//     // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':{
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;
//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId
//       })
//       const {purchaseId} = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId)

//       const userData = await User.findById(purchaseData.userId)
//       const courseData = await Course.findById(purchaseData.courseId.toString())

//       courseData.enrolledStudents.push(userData)
//       await courseData.save()

//       userData.enrolledCourses.push(courseData._id)
//       await userData.save()

//       purchaseData.status = 'completed'

//       await purchaseData.save()

//       break;
//     }


//     case 'payment_intent.payment_failed':{
//         const paymentIntent = event.data.object;
//         const paymentIntentId = paymentIntent.id;
//         const session = await stripeInstance.checkout.sessions.list({
//           payment_intent: paymentIntentId
//         })
//         const {purchaseId} = session.data[0].metadata;
//         const purchaseData = await Purchase.findById(purchaseId)

//         purchaseData.status = 'failed'
//         await purchaseData.save();
      
//       break;
//     }
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({received: true});
// }


// import Stripe from 'stripe';

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                if (process.env.NODE_ENV !== 'production') {
                    // Log webhook errors for debugging
                }
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await dbAdapter.purchases.findById(purchaseId);

            if (!purchaseData) {
                if (process.env.NODE_ENV !== 'production') {
                    // Log webhook errors for debugging
                }
                return;
            }

            const userData = await dbAdapter.users.findById(purchaseData.userId);
            const courseData = await dbAdapter.courses.findById(purchaseData.courseId.toString());

            if (!userData || !courseData) {
                if (process.env.NODE_ENV !== 'production') {
                    // Log webhook errors for debugging
                }
                return;
            }

            // Add user to enrolled students
            courseData.enrolledStudents.push(userData._id);
            await dbAdapter.courses.save(courseData);

            // Add course to user's enrolled courses
            userData.enrolledCourses.push(courseData._id);
            await dbAdapter.users.save(userData);

            // Update purchase status
            purchaseData.status = 'completed';
            await dbAdapter.purchases.save(purchaseData);

            // Send payment confirmation email
            try {
                await emailService.sendPaymentConfirmationEmail(userData, {
                    amount: purchaseData.amount || courseData.price || 0,
                    currency: purchaseData.currency || 'BRL',
                    paymentMethod: 'stripe',
                    paymentId: paymentIntent.id,
                });
            } catch (emailError) {
                // Failed to send payment confirmation email - non-critical
            }

            // Send course enrollment email
            try {
                await emailService.sendCourseEnrollmentEmail(userData, courseData);
            } catch (emailError) {
                // Failed to send enrollment email - non-critical
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                // Log webhook errors for debugging
            }
        }
    };

    const handlePaymentFailed = async (paymentIntent) => {
        try {
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                // No session data found for failed payment intent
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await dbAdapter.purchases.findById(purchaseId);

            if (!purchaseData) {
                if (process.env.NODE_ENV !== 'production') {
                    // Log webhook errors for debugging
                }
                return;
            }

            purchaseData.status = 'failed';
            await dbAdapter.purchases.save(purchaseData);
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                // Log webhook errors for debugging
            }
        }
    };

    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;

        case 'payment_intent.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;

        default:
            if (process.env.NODE_ENV !== 'production') {
                // Log unhandled webhook events for debugging
            }
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
};




