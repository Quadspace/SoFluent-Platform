import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {type:String, required: true},
        clerkId: {type:String, required: true, unique: true},
        name: {type:String, required: true},
        email: {type:String, required: true, index: true}, // Index for faster lookups
        imageUrl: {type:String, required: true},
        // Role-based access control
        role: {
            type: String,
            enum: ['master_admin', 'teacher', 'student'],
            default: 'student'
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        // Student dashboard fields
        streak: {type: Number, default: 0},
        lastActivityDate: {type: Date},
        weeklyHours: {type: Number, default: 0},
        dailyChallengeCompleted: {type: String}, // Date string
        learningPathName: {type: String, default: 'Career Advancement Path'},
        currentWeek: {type: Number, default: 1},
        totalWeeks: {type: Number, default: 6},
        activityLog: [{
            type: {type: String},
            date: {type: Date},
            metadata: {type: mongoose.Schema.Types.Mixed}
        }],
        achievements: [{
            achievementId: {type: String},
            unlockedAt: {type: Date}
        }],
        // Onboarding fields
        goal: {type: String},
        learningStyle: {type: String},
        studyTime: {type: String},
        onboardingCompleted: {type: Boolean, default: false},
        onboardingCompletedAt: {type: Date},
        // Instagram fields
        instagramConnect: {type: Boolean, default: false},
        instagramAccessToken: {type: String},
        instagramUserId: {type: String},
        instagramConnectedAt: {type: Date},
        instagramDisconnectedAt: {type: Date},
        // LinkedIn fields
        linkedInConnected: {type: Boolean, default: false},
        linkedInAccessToken: {type: String},
        linkedInProfile: {type: mongoose.Schema.Types.Mixed},
        linkedInConnectedAt: {type: Date},
        // Learn-to-Earn Real Money fields
        tier: {
            type: String,
            enum: ['free', 'academy', 'vip'],
            default: 'free'
        },
        realMoneyBalance: {type: Number, default: 0, min: 0}, // R$ available balance
        pendingWithdrawal: {type: Number, default: 0, min: 0}, // R$ pending in withdrawal requests
        totalEarned: {type: Number, default: 0, min: 0}, // Lifetime R$ earned
        totalWithdrawn: {type: Number, default: 0, min: 0}, // Lifetime R$ withdrawn
        lastEarningReset: {type: Date}, // Monthly reset tracking
        // Referral fields
        referralCode: {type: String, unique: true, sparse: true}, // User's unique referral code
        referredBy: {type: String, ref: 'User'} // User who referred them
    }, {timestamps: true}
);

const User = mongoose.model('User', userSchema)

export default User;