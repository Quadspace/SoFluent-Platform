/**
 * Student Onboarding Flow
 * Guides new students through goal setting and preferences
 * Creates personalized learning path immediately
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import InstagramConnect from '../../components/instagram/InstagramConnect';
import { motion, AnimatePresence } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import {
  Target,
  BookOpen,
  Heart,
  GraduationCap,
  Coffee,
  TrendingUp,
  Calendar,
  Clock,
  Instagram,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

// Step components - must be defined before Onboarding component
// Step 1: What's your main goal?
const Step1Goal = ({ selected, onSelect }) => {
  const goals = [
    {
      id: 'career',
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Career Advancement',
      description: 'Interviews, presentations, business English',
      color: 'from-blue-500/20 to-purple-500/20',
      border: 'border-blue-500/30'
    },
    {
      id: 'travel',
      icon: <Coffee className="w-8 h-8" />,
      title: 'Travel',
      description: 'Explore the world confidently',
      color: 'from-green-500/20 to-teal-500/20',
      border: 'border-green-500/30'
    },
    {
      id: 'academic',
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Academic',
      description: 'Study abroad, exams, research',
      color: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/30'
    },
    {
      id: 'personal',
      icon: <Heart className="w-8 h-8" />,
      title: 'Personal Growth',
      description: 'Build confidence, make friends',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30'
    }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-[#E91E63] mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
          What's your main goal?
        </h2>
        <p className="text-gray-400">We'll personalize your learning path based on your goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <motion.button
            key={goal.id}
            onClick={() => onSelect(goal.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selected === goal.id
                ? `${goal.color} ${goal.border} border-2`
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`${selected === goal.id ? 'text-white' : 'text-gray-400'}`}>
                {goal.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-400">{goal.description}</p>
              </div>
              {selected === goal.id && (
                <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Step 2: What's your English level?
const Step2EnglishLevel = ({ selected, onSelect }) => {
  const levels = [
    { id: 'beginner', name: 'Beginner (A1-A2)', description: 'Just starting out', progress: 0 },
    { id: 'intermediate', name: 'Intermediate (B1+)', description: 'Can have basic conversations', progress: 50 },
    { id: 'advanced', name: 'Advanced (B2-C1)', description: 'Fluent in most situations', progress: 80 },
    { id: 'fluent', name: 'Fluent (C2)', description: 'Native-like proficiency', progress: 100 }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <BookOpen className="w-16 h-16 text-[#E91E63] mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
          What's your English level?
        </h2>
        <p className="text-gray-400">Don't worry, we'll adjust as you learn!</p>
      </div>

      <div className="space-y-4">
        {levels.map((level) => (
          <motion.button
            key={level.id}
            onClick={() => onSelect(level.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
              selected === level.id
                ? 'bg-gradient-to-r from-[#E91E63]/20 to-[#D4AF37]/20 border-[#E91E63]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-white font-bold">{level.name}</h3>
                <p className="text-sm text-gray-400">{level.description}</p>
              </div>
              {selected === level.id && (
                <CheckCircle className="w-6 h-6 text-[#E91E63]" />
              )}
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E91E63] to-[#D4AF37] rounded-full"
                style={{ width: `${level.progress}%` }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Step 3: How do you prefer to learn?
const Step3LearningStyle = ({ selected, onSelect }) => {
  const styles = [
    {
      id: 'videos',
      icon: '📹',
      title: 'Videos',
      description: 'Watch and learn'
    },
    {
      id: 'practice',
      icon: '💪',
      title: 'Practice',
      description: 'Do and learn'
    },
    {
      id: 'social',
      icon: '👥',
      title: 'Social',
      description: 'Learn with others'
    },
    {
      id: 'mix',
      icon: '🎯',
      title: 'Mix of Everything',
      description: 'Variety is the spice of life'
    }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <Sparkles className="w-16 h-16 text-[#E91E63] mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
          How do you prefer to learn?
        </h2>
        <p className="text-gray-400">We'll tailor content to your style</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {styles.map((style) => (
          <motion.button
            key={style.id}
            onClick={() => onSelect(style.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl border-2 transition-all text-center ${
              selected === style.id
                ? 'bg-gradient-to-br from-[#E91E63]/20 to-[#D4AF37]/20 border-[#E91E63]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-4xl mb-3">{style.icon}</div>
            <h3 className="text-white font-bold mb-1">{style.title}</h3>
            <p className="text-sm text-gray-400">{style.description}</p>
            {selected === style.id && (
              <CheckCircle className="w-6 h-6 text-[#E91E63] mx-auto mt-2" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Step 4: Fitness level & Study time
const Step4FitnessTime = ({ fitnessLevel, studyTime, onFitnessSelect, onTimeSelect }) => {
  const fitnessLevels = [
    { id: 'beginner', name: 'Beginner', icon: '🌱' },
    { id: 'intermediate', name: 'Intermediate', icon: '💪' },
    { id: 'advanced', name: 'Advanced', icon: '🔥' },
    { id: 'not-interested', name: 'Not Interested', icon: '📚' }
  ];

  const studyTimes = [
    { id: 'morning', name: 'Morning', time: '6-10 AM', icon: '🌅' },
    { id: 'afternoon', name: 'Afternoon', time: '12-4 PM', icon: '☀️' },
    { id: 'evening', name: 'Evening', time: '6-10 PM', icon: '🌙' },
    { id: 'flexible', name: 'Flexible', time: 'Anytime', icon: '🕐' }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-[#E91E63] mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
          Tell us about yourself
        </h2>
        <p className="text-gray-400">Help us personalize your experience</p>
      </div>

      <div className="space-y-8">
        {/* Fitness Level */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">What's your fitness level?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fitnessLevels.map((level) => (
              <motion.button
                key={level.id}
                onClick={() => onFitnessSelect(level.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  fitnessLevel === level.id
                    ? 'bg-gradient-to-br from-[#E91E63]/20 to-[#D4AF37]/20 border-[#E91E63]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-3xl mb-2">{level.icon}</div>
                <div className="text-white text-sm font-semibold">{level.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Study Time */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">When do you study best?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {studyTimes.map((time) => (
              <motion.button
                key={time.id}
                onClick={() => onTimeSelect(time.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  studyTime === time.id
                    ? 'bg-gradient-to-br from-[#E91E63]/20 to-[#D4AF37]/20 border-[#E91E63]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-3xl mb-2">{time.icon}</div>
                <div className="text-white text-sm font-semibold mb-1">{time.name}</div>
                <div className="text-xs text-gray-400">{time.time}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Connect Instagram (Optional)
const Step5Instagram = ({ selected, onSelect }) => {
  const { backendUrl, getToken } = useContext(AppContext);

  return (
    <div>
      <div className="text-center mb-8">
        <Instagram className="w-16 h-16 text-[#E91E63] mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
          Connect Your Instagram (Optional)
        </h2>
        <p className="text-gray-400">Get personalized lessons from YOUR Instagram content!</p>
      </div>

      <div className="mb-6">
        <InstagramConnect
          onConnect={() => onSelect(true)}
          onDisconnect={() => onSelect(false)}
          connected={selected === true}
          backendUrl={backendUrl}
          getToken={getToken}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onSelect(false)}
          className="flex-1 p-4 rounded-xl border-2 border-white/10 hover:bg-white/10 bg-white/5 transition-all"
        >
          <span className="text-white font-semibold">Skip for Now</span>
        </button>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: null,
    englishLevel: null,
    learningStyle: null,
    fitnessLevel: null,
    studyTime: null,
    instagramConnect: false
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      
      if (token) {
        const response = await fetch(`${backendUrl}/api/student/onboarding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          // Navigate to dashboard
          navigate('/dashboard');
        } else {
          // Still navigate even if API fails (for preview mode)
          navigate('/dashboard');
        }
      } else {
        // Preview mode - just navigate
        navigate('/dashboard');
      }
    } catch (error) {
      // Navigate to dashboard on error
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <StandardPage
      seoTitle="Onboarding - So Fluent"
      seoDescription="Set up your personalized English learning journey"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#E91E63] to-[#D4AF37] rounded-full"
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-8 md:p-12"
          >
            {currentStep === 1 && (
              <Step1Goal
                selected={formData.goal}
                onSelect={(goal) => updateFormData('goal', goal)}
              />
            )}
            {currentStep === 2 && (
              <Step2EnglishLevel
                selected={formData.englishLevel}
                onSelect={(level) => updateFormData('englishLevel', level)}
              />
            )}
            {currentStep === 3 && (
              <Step3LearningStyle
                selected={formData.learningStyle}
                onSelect={(style) => updateFormData('learningStyle', style)}
              />
            )}
            {currentStep === 4 && (
              <Step4FitnessTime
                fitnessLevel={formData.fitnessLevel}
                studyTime={formData.studyTime}
                onFitnessSelect={(level) => updateFormData('fitnessLevel', level)}
                onTimeSelect={(time) => updateFormData('studyTime', time)}
              />
            )}
            {currentStep === 5 && (
              <Step5Instagram
                selected={formData.instagramConnect}
                onSelect={(connect) => updateFormData('instagramConnect', connect)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !formData.goal) ||
              (currentStep === 2 && !formData.englishLevel) ||
              (currentStep === 3 && !formData.learningStyle) ||
              (currentStep === 4 && (!formData.fitnessLevel || !formData.studyTime)) ||
              loading
            }
            className="px-8 py-3 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating your path...
              </>
            ) : currentStep === totalSteps ? (
              <>
                Complete Setup
                <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
      </div>
    </StandardPage>
  );
};

export default Onboarding;
