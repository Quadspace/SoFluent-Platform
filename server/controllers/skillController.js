/**
 * Skill Controller
 * Top 1% Enhancement: Skill trees
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import Skill from '../models/Skill.js';
import UserSkill from '../models/UserSkill.js';
import User from '../models/User.js';

/**
 * GET /api/skills
 * Get skill tree for user
 */
export const getSkillTree = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { category } = req.query;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        let filter = {};
        if (category) {
            filter.category = category;
        }

        const skills = await dbAdapter.find(Skill, filter, {
            sort: { 'position.tier': 1, 'position.y': 1, 'position.x': 1 }
        });

        // Get user's progress for each skill
        const skillsWithProgress = await Promise.all(skills.map(async (skill) => {
            const userSkill = await dbAdapter.findOne(UserSkill, {
                userId: user._id,
                skillId: skill._id
            });

            // Check if prerequisites are met
            let prerequisitesMet = true;
            if (skill.unlockRequirements?.skillsRequired?.length > 0) {
                const requiredSkills = await dbAdapter.find(UserSkill, {
                    userId: user._id,
                    skillId: { $in: skill.unlockRequirements.skillsRequired },
                    status: 'completed'
                });
                prerequisitesMet = requiredSkills.length === skill.unlockRequirements.skillsRequired.length;
            }

            return {
                ...skill.toObject(),
                status: userSkill?.status || (prerequisitesMet ? 'unlocked' : 'locked'),
                progress: userSkill?.progress || 0,
                lessonsCompleted: userSkill?.lessonsCompleted || 0,
                totalLessons: skill.lessons?.length || 0
            };
        }));

        res.json({
            success: true,
            skills: skillsWithProgress
        });
    } catch (error) {
        console.error('Error fetching skill tree:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/skills/:id/unlock
 * Unlock a skill
 */
export const unlockSkill = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const skill = await dbAdapter.findOne(Skill, { _id: id });
        if (!skill) {
            return res.json({ success: false, message: 'Skill not found' });
        }

        // Check prerequisites
        if (skill.unlockRequirements?.skillsRequired?.length > 0) {
            const requiredSkills = await dbAdapter.find(UserSkill, {
                userId: user._id,
                skillId: { $in: skill.unlockRequirements.skillsRequired },
                status: 'completed'
            });
            if (requiredSkills.length !== skill.unlockRequirements.skillsRequired.length) {
                return res.json({ success: false, message: 'Prerequisites not met' });
            }
        }

        // Create or update user skill
        let userSkill = await dbAdapter.findOne(UserSkill, {
            userId: user._id,
            skillId: id
        });

        if (!userSkill) {
            userSkill = await dbAdapter.create(UserSkill, {
                userId: user._id,
                skillId: id,
                status: 'unlocked',
                unlockedAt: new Date(),
                totalLessons: skill.lessons?.length || 0
            });
        } else if (userSkill.status === 'locked') {
            await dbAdapter.updateOne(UserSkill, { _id: userSkill._id }, {
                status: 'unlocked',
                unlockedAt: new Date()
            });
        }

        res.json({ success: true, userSkill });
    } catch (error) {
        console.error('Error unlocking skill:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getSkillTree,
    unlockSkill
};
