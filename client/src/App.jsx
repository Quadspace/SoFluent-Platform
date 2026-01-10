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
import StudentProfile from './pages/educator/StudentProfile'
import Payments from './pages/educator/Payments'
import Analytics from './pages/educator/Analytics'


const App = () => {


  const isEducatorRoute = useMatch('/educator/*')



  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer />
      {!isEducatorRoute &&<Navbar/> }
      
      <Routes>
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
        <Route path='/fluency-fit' element={<FluencyFitAcademy/>} />
        <Route path='/kids-corner' element={<KidsCorner/>} />
        <Route path='/products' element={<ProductCatalog/>} />
        <Route path='/products/:id' element={<ProductDetail/>} />
        <Route path='/feed' element={<Feed/>} />

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
    </div>
  )
}

export default App
