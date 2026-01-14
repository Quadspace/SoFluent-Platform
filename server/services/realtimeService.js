/**
 * Real-Time Service
 * Top 1% Enhancement: Real-time activity feed
 * Uses Server-Sent Events (SSE) for simplicity
 */

import EventEmitter from 'events';

class RealtimeService extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map(); // Map of userId -> response streams
    this.activityQueue = []; // Queue of recent activities
    this.maxQueueSize = 100;
  }

  /**
   * Add a client connection
   */
  addClient(userId, response) {
    // Set SSE headers
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx

    // Store client
    this.clients.set(userId, response);

    // Send initial connection message
    this.sendToClient(userId, {
      type: 'connected',
      message: 'Connected to real-time feed'
    });

    // Send recent activities
    this.sendRecentActivities(userId);

    // Handle client disconnect
    response.on('close', () => {
      this.clients.delete(userId);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Realtime] Client disconnected: ${userId}`);
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Realtime] Client connected: ${userId}`);
    }
  }

  /**
   * Remove a client connection
   */
  removeClient(userId) {
    this.clients.delete(userId);
  }

  /**
   * Send message to a specific client
   */
  sendToClient(userId, data) {
    const client = this.clients.get(userId);
    if (client && !client.destroyed) {
      try {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error(`[Realtime] Error sending to client ${userId}:`, error);
        this.removeClient(userId);
      }
    }
  }

  /**
   * Broadcast to all clients
   */
  broadcast(data) {
    this.clients.forEach((client, userId) => {
      this.sendToClient(userId, data);
    });
  }

  /**
   * Add activity to queue and broadcast
   */
  addActivity(activity) {
    // Add to queue
    this.activityQueue.unshift(activity);
    if (this.activityQueue.length > this.maxQueueSize) {
      this.activityQueue.pop();
    }

    // Broadcast to all clients
    this.broadcast({
      type: 'activity',
      activity
    });
  }

  /**
   * Send recent activities to a client
   */
  sendRecentActivities(userId) {
    if (this.activityQueue.length > 0) {
      this.sendToClient(userId, {
        type: 'recent_activities',
        activities: this.activityQueue.slice(0, 20) // Last 20 activities
      });
    }
  }

  /**
   * Get active users count
   */
  getActiveUsersCount() {
    return this.clients.size;
  }

  /**
   * Send active users count update
   */
  broadcastActiveUsersCount() {
    const count = this.getActiveUsersCount();
    this.broadcast({
      type: 'active_users',
      count
    });
  }
}

// Singleton instance
const realtimeService = new RealtimeService();

// Broadcast active users count every 30 seconds
setInterval(() => {
  realtimeService.broadcastActiveUsersCount();
}, 30000);

export default realtimeService;
