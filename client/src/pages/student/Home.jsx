import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import LearningMethodsSection from '../../components/student/LearningMethodsSection'
import ValuesSection from '../../components/student/ValuesSection'
import CriticalThinkingSection from '../../components/student/CriticalThinkingSection'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Logger from '../../components/Logger'
import StandardPage from '../../utils/pageConsistency'

const Home = () => {
  return (
    <StandardPage
      showNavbar={true}
      showFooter={true}
      seoTitle="So Fluent - Learn English with Personalized Courses"
      seoDescription="Transform your English fluency with AI-powered personalized learning, live fitness classes, and a vibrant community."
      background="bg-sofluent-dark"
    >
      <div className='flex flex-col items-center text-center'>
        <Hero/>
        <div className="block sm:hidden w-full">
          <Logger/>
        </div>
        <div className="w-full bg-sofluent-dark">
          <Companies/>
        </div>
        <div className="w-full bg-sofluent-dark">
          <LearningMethodsSection/>
        </div>
        <div className="w-full bg-white">
          <ValuesSection/>
        </div>
        <div className="w-full bg-sofluent-dark">
          <CriticalThinkingSection/>
        </div>
        <div className="w-full bg-sofluent-dark">
          <CoursesSection/>
        </div>
        <div className="w-full bg-white">
          <TestimonialsSection/>
        </div>
        <div className="w-full bg-sofluent-dark">
          <CallToAction/>
        </div>
      </div>
    </StandardPage>
  )
}

export default Home
