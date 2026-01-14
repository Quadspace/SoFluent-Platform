import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollMents from './pages/student/MyEnrollMents'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';
import About from './components/About'
import ContactForm from './components/ContactForm'
import PrivacyPolicy from './components/PrivacyPolicy'
import FluencyFitAcademy from './pages/fluency-fit/FluencyFitAcademy'
import KidsCorner from './pages/kids-corner/KidsCorner'
import ProductCatalog from './pages/products/ProductCatalog'
import ProductDetail from './pages/products/ProductDetail'
import Feed from './pages/student/Feed'
import StudentDashboard from './pages/student/Dashboard'
import Profile from './pages/student/Profile'
import Onboarding from './pages/student/Onboarding'
import Missions from './pages/student/Missions'
import Workouts from './pages/student/Workouts'
import AILifeMirror from './pages/student/AILifeMirror'
import Career from './pages/student/Career'
import Conversation from './pages/student/Conversation'
import Pronunciation from './pages/student/Pronunciation'
import StudyBuddy from './pages/student/StudyBuddy'
import SuccessStory from './pages/student/SuccessStory'
import LeaderboardPage from './pages/student/Leaderboard'
import StudyGroups from './pages/student/StudyGroups'
import SkillTree from './pages/student/SkillTree'
import RewardsShop from './pages/student/RewardsShop'
import StudentProfile from './pages/educator/StudentProfile'
import Payments from './pages/educator/Payments'
import Analytics from './pages/educator/Analytics'
import Pricing from './pages/pricing/Pricing'
import MyEnglishJourney from './pages/products/MyEnglishJourney'
import SoFluentTalks from './pages/products/SoFluentTalks'
import TravelEssentials from './pages/products/TravelEssentials'
import ESPCourses from './pages/products/ESPCourses'
import MasterAdminDashboard from './pages/admin/MasterAdminDashboard'
import CohortManagement from './pages/admin/CohortManagement'
import StudentManagement from './pages/admin/StudentManagement'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import AdminNavbar from './components/admin/AdminNavbar'
import TeacherNavbar from './components/teacher/TeacherNavbar'
import ProtectedRoute from './components/common/ProtectedRoute'
import useUserRole from './hooks/useUserRole'
import CommandPalette from './components/common/CommandPalette'
import ErrorBoundary from './components/common/ErrorBoundary'
import SkipToContent from './components/common/SkipToContent'
import SEOHead from './components/seo/SEOHead'
import { ThemeProvider } from './context/ThemeContext'
import ThemeSelector from './components/admin/ThemeSelector'
import './styles/theme.css'


const App = () => {
  const { role, loading: roleLoading } = useUserRole();
  const isEducatorRoute = useMatch('/educator/*')
  const isAdminRoute = useMatch('/admin/*')
  const isTeacherRoute = useMatch('/teacher/*')



  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className='text-default min-h-screen bg-theme-background'>
          <SkipToContent />
          <SEOHead 
            title="So Fluent - English Learning Platform"
            description="Learn English with personalized courses, live classes, and AI-powered learning. Join thousands of students improving their English fluency."
          />
          <ToastContainer />
          <CommandPalette />
          <ThemeSelector isAdmin={role === 'master_admin'} showForAll={true} />
          {isAdminRoute && <AdminNavbar/> }
          {isTeacherRoute && <TeacherNavbar/> }
          {!isEducatorRoute && !isAdminRoute && !isTeacherRoute && <Navbar/> }
        
        <main id="main-content">
          <Routes>
        {/* Master Admin Routes */}
        <Route path='/admin/dashboard' element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <MasterAdminDashboard/>
          </ProtectedRoute>
        } />
        <Route path='/admin/cohorts' element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <CohortManagement/>
          </ProtectedRoute>
        } />
        <Route path='/admin/students' element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <StudentManagement/>
          </ProtectedRoute>
        } />

        {/* Teacher Admin Routes */}
        <Route path='/teacher/dashboard' element={
          <ProtectedRoute allowedRoles={['teacher', 'master_admin']}>
            <TeacherDashboard/>
          </ProtectedRoute>
        } />
        <Route path='/teacher/students' element={
          <ProtectedRoute allowedRoles={['teacher', 'master_admin']}>
            <TeacherDashboard/>
          </ProtectedRoute>
        } />
        <Route path='/teacher/earnings' element={
          <ProtectedRoute allowedRoles={['teacher', 'master_admin']}>
            <TeacherDashboard/>
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path='/' element={<Home/>} />
        <Route path='/course-list' element={<CoursesList/>} />
        <Route path='/course-list/:input' element={<CoursesList/>} />
        <Route path='/course/:id' element={<CourseDetails/>} />
        <Route path='/my-enrollments' element={<MyEnrollMents/>} />
        <Route path='/player/:courseId' element={<Player/>} />
        <Route path='/loading/:path' element={<Loading/>} />

        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<ContactForm/>} />
        <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
        <Route path='/pricing' element={<Pricing/>} />
        <Route path='/my-english-journey' element={<MyEnglishJourney/>} />
        <Route path='/so-fluent-talks' element={<SoFluentTalks/>} />
        <Route path='/travel-essentials' element={<TravelEssentials/>} />
        <Route path='/esp-courses' element={<ESPCourses/>} />
        <Route path='/fluency-fit' element={<FluencyFitAcademy/>} />
        <Route path='/kids-corner' element={<KidsCorner/>} />
        <Route path='/products' element={<ProductCatalog/>} />
        <Route path='/products/:id' element={<ProductDetail/>} />
        <Route path='/feed' element={<Feed/>} />
        <Route path='/dashboard' element={<StudentDashboard/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/onboarding' element={<Onboarding/>} />
        <Route path='/missions' element={<Missions/>} />
        <Route path='/workouts' element={<Workouts/>} />
        <Route path='/ai-life-mirror' element={<AILifeMirror/>} />
        <Route path='/career' element={<Career/>} />
        <Route path='/conversation' element={<Conversation/>} />
        <Route path='/pronunciation' element={<Pronunciation/>} />
        <Route path='/study-buddy' element={<StudyBuddy/>} />
        <Route path='/success-story' element={<SuccessStory/>} />
        <Route path='/leaderboard' element={<LeaderboardPage/>} />
        <Route path='/study-groups' element={<StudyGroups/>} />
        <Route path='/skill-tree' element={<SkillTree/>} />
        <Route path='/rewards-shop' element={<RewardsShop/>} />

        <Route path='/educator' element={ <Educator />} >
            <Route path='/educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='student-enrolled' element={<StudentsEnrolled />} />
            <Route path='students/:id' element={<StudentProfile />} />
            <Route path='payments' element={<Payments />} />
            <Route path='analytics' element={<Analytics />} />
        </Route>

          </Routes>
        </main>
      </div>
    </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
