/**
 * Activity Middleware
 * Top 1% Enhancement: Track and broadcast user activities
 */

import realtimeService from '../services/realtimeService.js';

/**
 * Create activity and broadcast it
 */
export const createActivity = (type, data) => {
  const activity = {
    type,
    data,
    timestamp: new Date().toISOString()
  };

  // Broadcast to real-time service
  realtimeService.addActivity(activity);

  return activity;
};

/**
 * Middleware to track activities
 */
export const trackActivity = (activityType) => {
  return (req, res, next) => {
    // Track activity after response
    const originalSend = res.send;
    res.send = function (body) {
      if (res.statusCode < 400) {
        // Activity was successful
        createActivity(activityType, {
          userId: req.auth?.userId,
          ...req.body
        });
      }
      return originalSend.call(this, body);
    };
    next();
  };
};

export default {
  createActivity,
  trackActivity
};
