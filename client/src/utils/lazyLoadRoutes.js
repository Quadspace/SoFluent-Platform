/**
 * Lazy Load Routes
 * Code splitting for better performance
 */

import { lazy } from 'react';

// Student pages
export const Home = lazy(() => import('../pages/student/Home'));
export const CoursesList = lazy(() => import('../pages/student/CoursesList'));
export const CourseDetails = lazy(() => import('../pages/student/CourseDetails'));
export const Dashboard = lazy(() => import('../pages/student/Dashboard'));
export const Feed = lazy(() => import('../pages/student/Feed'));
export const Profile = lazy(() => import('../pages/student/Profile'));
export const MyEnrollMents = lazy(() => import('../pages/student/MyEnrollMents'));
export const Player = lazy(() => import('../pages/student/Player'));
export const Onboarding = lazy(() => import('../pages/student/Onboarding'));
export const Missions = lazy(() => import('../pages/student/Missions'));
export const Workouts = lazy(() => import('../pages/student/Workouts'));
export const AILifeMirror = lazy(() => import('../pages/student/AILifeMirror'));
export const Career = lazy(() => import('../pages/student/Career'));
export const Conversation = lazy(() => import('../pages/student/Conversation'));
export const Pronunciation = lazy(() => import('../pages/student/Pronunciation'));
export const StudyBuddy = lazy(() => import('../pages/student/StudyBuddy'));
export const SuccessStory = lazy(() => import('../pages/student/SuccessStory'));
export const Leaderboard = lazy(() => import('../pages/student/Leaderboard'));
export const StudyGroups = lazy(() => import('../pages/student/StudyGroups'));
export const SkillTree = lazy(() => import('../pages/student/SkillTree'));
export const RewardsShop = lazy(() => import('../pages/student/RewardsShop'));

// Product pages
export const ProductCatalog = lazy(() => import('../pages/products/ProductCatalog'));
export const ProductDetail = lazy(() => import('../pages/products/ProductDetail'));
export const MyEnglishJourney = lazy(() => import('../pages/products/MyEnglishJourney'));
export const SoFluentTalks = lazy(() => import('../pages/products/SoFluentTalks'));
export const TravelEssentials = lazy(() => import('../pages/products/TravelEssentials'));
export const ESPCourses = lazy(() => import('../pages/products/ESPCourses'));

// Other pages
export const Pricing = lazy(() => import('../pages/pricing/Pricing'));
export const FluencyFitAcademy = lazy(() => import('../pages/fluency-fit/FluencyFitAcademy'));
export const KidsCorner = lazy(() => import('../pages/kids-corner/KidsCorner'));
export const About = lazy(() => import('../components/About'));
export const ContactForm = lazy(() => import('../components/ContactForm'));
export const PrivacyPolicy = lazy(() => import('../components/PrivacyPolicy'));

// Admin pages (lazy loaded but not code split for admin routes)
export const MasterAdminDashboard = lazy(() => import('../pages/admin/MasterAdminDashboard'));
export const CohortManagement = lazy(() => import('../pages/admin/CohortManagement'));
export const StudentManagement = lazy(() => import('../pages/admin/StudentManagement'));

// Teacher pages
export const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard'));

// Educator pages
export const EducatorDashboard = lazy(() => import('../pages/educator/Dashboard'));
export const AddCourse = lazy(() => import('../pages/educator/AddCourse'));
export const MyCourses = lazy(() => import('../pages/educator/MyCourses'));
export const StudentsEnrolled = lazy(() => import('../pages/educator/StudentsEnrolled'));
export const StudentProfile = lazy(() => import('../pages/educator/StudentProfile'));
export const Payments = lazy(() => import('../pages/educator/Payments'));
export const Analytics = lazy(() => import('../pages/educator/Analytics'));
