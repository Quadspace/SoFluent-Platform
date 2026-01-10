import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Users, Video, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkoutSchedule = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState(null);

  // Sample workout schedule data
  const weeklySchedule = [
    {
      day: t('workoutSchedule.days.monday', 'Monday'),
      workouts: [
        {
          time: '07:00',
          type: 'HIIT',
          title: t('workoutSchedule.types.hiit', 'High Intensity Interval Training'),
          instructor: 'Heloisa',
          duration: '30 min',
          enrolled: 45,
          maxCapacity: 50,
          zoomLink: '#'
        },
        {
          time: '18:00',
          type: 'Yoga',
          title: t('workoutSchedule.types.yoga', 'Yoga Flow'),
          instructor: 'Heloisa',
          duration: '45 min',
          enrolled: 32,
          maxCapacity: 50,
          zoomLink: '#'
        }
      ]
    },
    {
      day: t('workoutSchedule.days.wednesday', 'Wednesday'),
      workouts: [
        {
          time: '07:00',
          type: 'Dance',
          title: t('workoutSchedule.types.dance', 'Dance Fitness'),
          instructor: 'Heloisa',
          duration: '40 min',
          enrolled: 38,
          maxCapacity: 50,
          zoomLink: '#'
        }
      ]
    },
    {
      day: t('workoutSchedule.days.friday', 'Friday'),
      workouts: [
        {
          time: '07:00',
          type: 'Strength',
          title: t('workoutSchedule.types.strength', 'Strength Training'),
          instructor: 'Heloisa',
          duration: '35 min',
          enrolled: 28,
          maxCapacity: 50,
          zoomLink: '#'
        }
      ]
    }
  ];

  const handleRSVP = (workout) => {
    // TODO: Implement RSVP functionality with backend
    // For now, show confirmation
    alert(t('workoutSchedule.rsvp.confirm', `RSVP confirmed for ${workout.title} at ${workout.time}`));
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          {t('workoutSchedule.title', 'Weekly Workout Schedule')}
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('workoutSchedule.subtitle', 'Join live workout sessions and practice English while getting fit')}
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {weeklySchedule.map((daySchedule, index) => (
            <motion.div
              key={daySchedule.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-xl font-bold text-sofluent-pink mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {daySchedule.day}
              </h3>
              
              {daySchedule.workouts.length > 0 ? (
                <div className="space-y-4">
                  {daySchedule.workouts.map((workout, workoutIndex) => (
                    <div
                      key={workoutIndex}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-800">{workout.time}</span>
                            <span className="text-sm text-gray-500">({workout.duration})</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">{workout.title}</h4>
                          <p className="text-sm text-gray-600">{workout.instructor}</p>
                        </div>
                        <span className="bg-sofluent-pink/10 text-sofluent-pink px-2 py-1 rounded text-xs font-semibold">
                          {workout.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {workout.enrolled}/{workout.maxCapacity}
                        </div>
                        <button
                          onClick={() => handleRSVP(workout)}
                          className="bg-sofluent-pink text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors"
                        >
                          {t('workoutSchedule.rsvp.button', 'RSVP')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {t('workoutSchedule.noWorkouts', 'No workouts scheduled')}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {t('workoutSchedule.note', 'All sessions are recorded and available in the workout library')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSchedule;
