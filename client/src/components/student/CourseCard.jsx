import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import { Star, BookOpen, ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { getProfessionalImage, imageList } from '../../assets/professional-images'

const CourseCard = ({ course }) => {
  const { currency, calculateRating, calculateNoOfLectures } = useContext(AppContext)
  
  const rating = calculateRating(course)
  const lectureCount = calculateNoOfLectures ? calculateNoOfLectures(course) : 0
  const price = course.coursePrice - (course.discount || 0) * course.coursePrice / 100

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link 
        to={'/course/' + course._id} 
        onClick={() => scrollTo(0, 0)} 
        className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
      >
        {/* Thumbnail with Beautiful Overlay */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src={course.courseThumbnail || getProfessionalImage(imageList[Math.floor(Math.random() * imageList.length)], 'large')} 
            alt={course.courseTitle}
            onError={(e) => {
              // Fallback to professional image if course thumbnail fails
              const fallbackImage = getProfessionalImage(imageList[Math.floor(Math.random() * imageList.length)], 'large');
              if (fallbackImage) {
                e.target.src = fallbackImage;
              } else {
                e.target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400';
              }
            }}
          />
          {/* Beautiful Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Academy Badge - Check if course is Academy-related */}
          {(course.courseTitle?.toLowerCase().includes('fluency fit') || 
            course.courseTitle?.toLowerCase().includes('academy') ||
            course.tags?.includes('academy') ||
            course.category === 'academy') && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] px-4 py-2 rounded-xl shadow-xl border-2 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white animate-pulse" />
                <span className="font-black text-white text-xs uppercase tracking-wider">Academy</span>
              </div>
            </div>
          )}

          {/* Beautiful Price Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#E91E63] to-[#C2185B] px-5 py-2.5 rounded-xl shadow-xl">
            <span className="font-black text-white text-lg">
              {price === 0 ? 'GRÁTIS' : `${currency || 'R$'}${price.toFixed(0)}`}
            </span>
          </div>

          {/* Hover Arrow Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute bottom-4 left-4 bg-white p-3 rounded-full shadow-xl border-2 border-[#E91E63]"
          >
            <ArrowRight className="w-5 h-5 text-[#E91E63]" />
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-white">
          {/* Title */}
          <h3 className="font-black text-[#1A1A1A] text-2xl mb-4 line-clamp-2 group-hover:text-[#E91E63] transition-colors leading-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {course.courseTitle}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-base mb-6 line-clamp-2 leading-relaxed">
            {course.courseDescription || 'Transform your English skills with this comprehensive course.'}
          </p>
          
          {/* Meta Info Row */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[#1A1A1A] font-bold text-lg">{rating || '5.0'}</span>
              <span className="text-gray-500 text-sm">
                ({course.courseRatings?.length || 0})
              </span>
            </div>
            
            {/* Lectures */}
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-semibold">{lectureCount || 5} aulas</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center text-white text-base font-black shadow-lg">
              {course.educator?.name?.[0] || 'H'}
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Instrutor</div>
              <div className="text-sm font-bold text-[#1A1A1A]">
                {course.educator?.name || 'Heloisa'}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseCard
