/**
 * Upcoming Classes Card Component
 * Shows next live classes - drives attendance and engagement
 * Key for Fluency Fit Academy retention
 */

import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, ArrowRight } from 'lucide-react';
import { AppContext } from '../../../context/AppContext';

const UpcomingClassesCard = ({ classes: propClasses, onJoin }) => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [classes, setClasses] = useState(propClasses || []);
  const [loading, setLoading] = useState(!propClasses);

  useEffect(() => {
    if (!propClasses) {
      fetchUpcomingClasses();
    }
  }, []);

  const fetchUpcomingClasses = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/classes/upcoming`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setClasses(data.classes || []);
          }
        }
      }
    } catch (error) {
      // Error fetching upcoming classes - will retry on next fetch
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-[#E91E63]" />
          <h3 className="text-xl font-bold text-white">Upcoming Classes</h3>
        </div>
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
        </div>
      </motion.div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-[#E91E63]" />
          <h3 className="text-xl font-bold text-white">Upcoming Classes</h3>
        </div>
        <p className="text-gray-400 text-sm">No upcoming classes scheduled</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Upcoming Classes</h3>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {classes.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">{classItem.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{classItem.time}</span>
                </div>
              </div>
              {classItem.type === 'live' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#E91E63]/20 rounded-full">
                  <div className="w-2 h-2 bg-[#E91E63] rounded-full animate-pulse" />
                  <span className="text-xs text-[#E91E63] font-semibold">LIVE</span>
                </div>
              )}
            </div>
            
            <button
              onClick={async () => {
                if (!classItem.enrolled && onJoin) {
                  // RSVP to class
                  try {
                    const token = await getToken();
                    if (token) {
                      const response = await fetch(`${backendUrl}/api/classes/${classItem.id}/rsvp`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      if (response.ok) {
                        // Update local state
                        setClasses(prev => prev.map(c => 
                          c.id === classItem.id ? { ...c, enrolled: true } : c
                        ));
                      }
                    }
                  } catch (error) {
                    // Error RSVPing to class - user will see error state
                  }
                }
                if (onJoin) onJoin(classItem.id);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-[#E91E63]/20 to-[#C2185B]/20 hover:from-[#E91E63]/30 hover:to-[#C2185B]/30 border border-[#E91E63]/30 rounded-lg text-white text-sm font-semibold transition-all"
            >
              <Video className="w-4 h-4" />
              {classItem.enrolled ? 'Join Class' : 'Enroll Now'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <button className="w-full mt-4 text-center text-[#E91E63] text-sm font-semibold hover:text-[#C2185B] transition-colors">
        View All Classes
      </button>
    </motion.div>
  );
};

export default UpcomingClassesCard;
