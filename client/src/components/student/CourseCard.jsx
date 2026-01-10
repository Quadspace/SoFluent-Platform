import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import { Star, Clock, BookOpen } from 'lucide-react'

const CourseCard = ({ course }) => {
  const { currency, calculateRating, calculateNoOfLectures } = useContext(AppContext)
  
  const rating = calculateRating(course)
  const lectureCount = calculateNoOfLectures ? calculateNoOfLectures(course) : 0
  const price = course.coursePrice - (course.discount || 0) * course.coursePrice / 100

  return (
    <Link 
      to={'/course/' + course._id} 
      onClick={() => scrollTo(0, 0)} 
      className="sf-card overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={course.courseThumbnail} 
          alt={course.courseTitle}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400';
          }}
        />
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-[var(--sf-black)]/80 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="font-semibold text-[var(--sf-coral)]">
            {price === 0 ? 'Free' : `${currency || 'R$'}${price.toFixed(0)}`}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-display font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-[var(--sf-coral)] transition-colors">
          {course.courseTitle}
        </h3>
        
        {/* Description */}
        <p className="text-[var(--sf-gray-400)] text-sm mb-4 line-clamp-2">
          {course.courseDescription || 'Transform your English skills with this comprehensive course.'}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[var(--sf-gold)] text-[var(--sf-gold)]" />
            <span className="text-white font-medium">{rating || '5.0'}</span>
            <span className="text-[var(--sf-gray-500)]">
              ({course.courseRatings?.length || 0})
            </span>
          </div>
          
          {/* Lectures */}
          <div className="flex items-center gap-1 text-[var(--sf-gray-400)]">
            <BookOpen className="w-4 h-4" />
            <span>{lectureCount || 5} lessons</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--sf-coral)]/20 flex items-center justify-center text-[var(--sf-coral)] text-xs font-semibold">
            {course.educator?.name?.[0] || 'H'}
          </div>
          <span className="text-[var(--sf-gray-400)] text-sm">
            {course.educator?.name || 'Heloisa'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
