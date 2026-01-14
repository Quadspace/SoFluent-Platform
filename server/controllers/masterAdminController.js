/**
 * Master Admin Controller
 * 3-Tier Platform: Level 1 - Master Admin operations
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import Cohort from '../models/Cohort.js';
import Teacher from '../models/Teacher.js';
import Financials from '../models/Financials.js';
import { Purchase } from '../models/Purchase.js';

/**
 * GET /api/admin/dashboard
 * Get Master Admin dashboard metrics
 */
export const getDashboard = async (req, res) => {
    try {
        // Get all users
        const allUsers = await dbAdapter.find(User, {});
        const students = allUsers.filter(u => u.role === 'student' || !u.role);
        const teachers = allUsers.filter(u => u.role === 'teacher');
        
        // Get all purchases for revenue calculation
        const purchases = await dbAdapter.find(Purchase, {});
        
        // Calculate revenue (this month)
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const thisMonthPurchases = purchases.filter(p => {
            const purchaseDate = new Date(p.createdAt);
            const purchaseMonth = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, '0')}`;
            return purchaseMonth === thisMonth;
        });
        
        const revenue = thisMonthPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);
        
        // Get financials for this month
        let financials = await dbAdapter.findOne(Financials, { month: thisMonth });
        if (!financials) {
            // Create default financials
            financials = await dbAdapter.create(Financials, {
                month: thisMonth,
                revenue: { total: revenue },
                expenses: { total: 0 },
                profit: { gross: revenue, net: revenue, margin: 100 },
                students: {
                    new: 0,
                    churned: 0,
                    active: students.length,
                    total: students.length
                },
                mrr: revenue,
                arr: revenue * 12
            });
        }
        
        // Calculate profit
        const expenses = financials.expenses?.total || 0;
        const profit = revenue - expenses;
        const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
        
        // Get active cohorts
        const activeCohorts = await dbAdapter.find(Cohort, { status: 'active' });
        
        res.json({
            success: true,
            dashboard: {
                metrics: {
                    revenue: revenue,
                    students: students.length,
                    teachers: teachers.length,
                    profit: profit,
                    mrr: financials.mrr || revenue,
                    churn: financials.students?.churned || 0
                },
                revenueGrowth: 15, // TODO: Calculate from previous month
                studentGrowth: 23, // TODO: Calculate
                teacherGrowth: 2, // TODO: Calculate
                profitMargin: profitMargin,
                activeCohorts: activeCohorts.length
            }
        });
    } catch (error) {
        console.error('Error fetching admin dashboard:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/admin/cohorts
 * Get all cohorts (with drag-and-drop positions)
 */
export const getCohorts = async (req, res) => {
    try {
        const { status, sortBy } = req.query;
        
        let filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        const cohorts = await dbAdapter.find(Cohort, filter, {
            sort: sortBy === 'students' ? { 'capacity.current': -1 } : 
                  sortBy === 'revenue' ? { 'pricing.amount': -1 } :
                  { 'schedule.startDate': -1 }
        });
        
        // Populate teacher info
        const cohortsWithTeachers = await Promise.all(cohorts.map(async (cohort) => {
            const teacher = await dbAdapter.findOne(User, { _id: cohort.teacherId });
            return {
                ...cohort.toObject(),
                teacher: teacher ? {
                    name: teacher.name,
                    imageUrl: teacher.imageUrl
                } : null
            };
        }));
        
        res.json({
            success: true,
            cohorts: cohortsWithTeachers
        });
    } catch (error) {
        console.error('Error fetching cohorts:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/admin/cohorts
 * Create a new cohort
 */
export const createCohort = async (req, res) => {
    try {
        const {
            name,
            description,
            teacherId,
            schedule,
            capacity,
            pricing,
            color
        } = req.body;
        
        const cohort = await dbAdapter.create(Cohort, {
            name,
            description,
            teacherId,
            schedule: {
                startDate: new Date(schedule.startDate),
                endDate: new Date(schedule.endDate),
                classTimes: schedule.classTimes || []
            },
            capacity: {
                max: capacity?.max || 50,
                current: 0
            },
            pricing: {
                tier: pricing.tier,
                amount: pricing.amount
            },
            status: 'draft',
            color: color || '#E91E63',
            position: { x: 0, y: 0 }
        });
        
        // Auto-create Google Classroom course (if Google integration enabled)
        try {
            const teacher = await dbAdapter.findOne(User, { _id: teacherId });
            if (teacher && teacher.email && process.env.GOOGLE_CLIENT_ID) {
                const googleClassroomService = (await import('../services/googleClassroom.js')).default;
                const classroomResult = await googleClassroomService.createCourse(
                    teacher.email,
                    name,
                    description || `Cohort: ${name}`,
                    `Tier: ${pricing.tier}`
                );
                
                if (classroomResult.success) {
                    // Store Google Classroom ID in cohort
                    cohort.googleClassroomId = classroomResult.courseId;
                    await dbAdapter.update(Cohort, { _id: cohort._id }, { googleClassroomId: classroomResult.courseId });
                }
            }
        } catch (googleError) {
            // Log but don't fail cohort creation if Google sync fails
            console.warn('Google Classroom auto-sync failed:', googleError.message);
        }
        
        res.json({
            success: true,
            cohort
        });
    } catch (error) {
        console.error('Error creating cohort:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * PUT /api/admin/cohorts/:id/position
 * Update cohort position (drag-and-drop)
 */
export const updateCohortPosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { x, y } = req.body;
        
        await dbAdapter.updateOne(Cohort, { _id: id }, {
            position: { x, y }
        });
        
        res.json({
            success: true,
            message: 'Position updated'
        });
    } catch (error) {
        console.error('Error updating cohort position:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/admin/students
 * Get all students (with hover-to-zoom details)
 */
export const getStudents = async (req, res) => {
    try {
        const { search, filter, tier } = req.query;
        
        let query = { role: { $in: ['student', null] } }; // Include users without role set
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        const students = await dbAdapter.find(User, query);
        
        // Get student details with purchases and cohorts
        const studentsWithDetails = await Promise.all(students.map(async (student) => {
            const purchases = await dbAdapter.find(Purchase, { userId: student._id });
            const cohorts = await dbAdapter.find(Cohort, { students: student._id });
            
            // Calculate LTV (Lifetime Value)
            const totalSpent = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
            const monthsActive = student.createdAt ? 
                Math.floor((new Date() - new Date(student.createdAt)) / (1000 * 60 * 60 * 24 * 30)) : 0;
            const ltv = monthsActive > 0 ? (totalSpent / monthsActive) * 12 : totalSpent;
            
            return {
                ...student.toObject(),
                totalSpent,
                ltv,
                cohorts: cohorts.map(c => ({
                    _id: c._id,
                    name: c.name,
                    status: c.status
                })),
                subscription: purchases.length > 0 ? {
                    tier: purchases[0].productType || 'academy',
                    amount: purchases[0].amount || 0
                } : null
            };
        }));
        
        res.json({
            success: true,
            students: studentsWithDetails
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/admin/teachers
 * Get all teachers
 */
export const getTeachers = async (req, res) => {
    try {
        const teachers = await dbAdapter.find(Teacher, {});
        
        // Populate user info
        const teachersWithUsers = await Promise.all(teachers.map(async (teacher) => {
            const user = await dbAdapter.findOne(User, { _id: teacher.userId });
            return {
                ...teacher.toObject(),
                user: user ? {
                    name: user.name,
                    email: user.email,
                    imageUrl: user.imageUrl
                } : null
            };
        }));
        
        res.json({
            success: true,
            teachers: teachersWithUsers
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/admin/financials
 * Get financial dashboard data
 */
export const getFinancials = async (req, res) => {
    try {
        const { month } = req.query;
        const now = new Date();
        const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        let financials = await dbAdapter.findOne(Financials, { month: targetMonth });
        
        if (!financials) {
            // Calculate from purchases
            const purchases = await dbAdapter.find(Purchase, {});
            const monthPurchases = purchases.filter(p => {
                const purchaseDate = new Date(p.createdAt);
                const purchaseMonth = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, '0')}`;
                return purchaseMonth === targetMonth;
            });
            
            const revenue = monthPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);
            
            financials = await dbAdapter.create(Financials, {
                month: targetMonth,
                revenue: { total: revenue },
                expenses: { total: 0 },
                profit: { gross: revenue, net: revenue, margin: 100 },
                students: {
                    new: 0,
                    churned: 0,
                    active: 0,
                    total: 0
                },
                mrr: revenue,
                arr: revenue * 12
            });
        }
        
        res.json({
            success: true,
            financials
        });
    } catch (error) {
        console.error('Error fetching financials:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getDashboard,
    getCohorts,
    createCohort,
    updateCohortPosition,
    getStudents,
    getTeachers,
    getFinancials
};
