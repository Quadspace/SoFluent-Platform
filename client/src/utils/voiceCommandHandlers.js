/**
 * Voice Command Handlers
 * Pre-built command handlers for common actions
 */

import { useNavigate } from 'react-router-dom';

/**
 * Navigation Commands
 */
export const createNavigationHandlers = (navigate) => {
  return [
    {
      pattern: /^(go to|navigate to|open|show)\s+(home|dashboard|profile|settings|courses|students|cohorts|analytics|payments)/i,
      handler: (transcript, params, confidence) => {
        const page = transcript.match(/(home|dashboard|profile|settings|courses|students|cohorts|analytics|payments)/i)?.[1];
        if (page) {
          const routes = {
            home: '/',
            dashboard: '/dashboard',
            profile: '/profile',
            settings: '/settings',
            courses: '/courses',
            students: '/admin/students',
            cohorts: '/admin/cohorts',
            analytics: '/educator/analytics',
            payments: '/educator/payments'
          };
          
          if (routes[page.toLowerCase()]) {
            navigate(routes[page.toLowerCase()]);
          }
        }
      },
      description: 'Navigate to pages',
      category: 'navigation',
      priority: 10
    }
  ];
};

/**
 * Course Commands
 */
export const createCourseHandlers = (onAction) => {
  return [
    {
      pattern: /^(start|begin|open)\s+(lesson|course)\s+(\d+)/i,
      handler: (transcript, params, confidence) => {
        const lessonNumber = parseInt(transcript.match(/\d+/)?.[0]);
        if (lessonNumber && onAction) {
          onAction('startLesson', { lessonNumber });
        }
      },
      description: 'Start lesson by number',
      category: 'courses',
      priority: 10
    },
    {
      pattern: /^(complete|finish|mark as complete)\s+(lesson|course)/i,
      handler: (transcript, params, confidence) => {
        if (onAction) {
          onAction('completeLesson', {});
        }
      },
      description: 'Complete current lesson',
      category: 'courses',
      priority: 9
    },
    {
      pattern: /^(next|skip|go to next)\s+(lesson|step)/i,
      handler: (transcript, params, confidence) => {
        if (onAction) {
          onAction('nextLesson', {});
        }
      },
      description: 'Go to next lesson',
      category: 'courses',
      priority: 8
    }
  ];
};

/**
 * Student Management Commands
 */
export const createStudentHandlers = (onAction) => {
  return [
    {
      pattern: /^(show|find|search for)\s+student\s+(.+)/i,
      handler: (transcript, params, confidence) => {
        const studentName = transcript.match(/student\s+(.+)/i)?.[1];
        if (studentName && onAction) {
          onAction('searchStudent', { name: studentName });
        }
      },
      description: 'Search for student',
      category: 'students',
      priority: 10
    },
    {
      pattern: /^(add|create|new)\s+student/i,
      handler: (transcript, params, confidence) => {
        if (onAction) {
          onAction('addStudent', {});
        }
      },
      description: 'Add new student',
      category: 'students',
      priority: 9
    }
  ];
};

/**
 * Cohort Commands
 */
export const createCohortHandlers = (onAction) => {
  return [
    {
      pattern: /^(create|add|new)\s+cohort/i,
      handler: (transcript, params, confidence) => {
        if (onAction) {
          onAction('createCohort', {});
        }
      },
      description: 'Create new cohort',
      category: 'cohorts',
      priority: 10
    },
    {
      pattern: /^(show|list|display)\s+cohorts/i,
      handler: (transcript, params, confidence) => {
        if (onAction) {
          onAction('listCohorts', {});
        }
      },
      description: 'List all cohorts',
      category: 'cohorts',
      priority: 8
    }
  ];
};

/**
 * General Commands
 */
export const createGeneralHandlers = (onAction) => {
  return [
    {
      pattern: /^(help|what can i say|commands|voice commands)/i,
      handler: (transcript, params, confidence) => {
        if (onAction) {
          onAction('showHelp', {});
        }
      },
      description: 'Show available commands',
      category: 'general',
      priority: 5
    },
    {
      pattern: /^(stop|cancel|exit|close)/i,
      handler: (transcript, params, confidence) => {
        if (onAction) {
          onAction('stop', {});
        }
      },
      description: 'Stop current action',
      category: 'general',
      priority: 7
    }
  ];
};

/**
 * Register all default commands
 */
export const registerDefaultCommands = (voiceCommands, handlers) => {
  const unregisterFunctions = [];
  
  handlers.forEach(handler => {
    const unregister = voiceCommands.registerCommand(
      handler.pattern,
      handler.handler,
      {
        priority: handler.priority || 0,
        context: handler.context || 'global',
        description: handler.description || '',
        category: handler.category || 'general'
      }
    );
    
    unregisterFunctions.push(unregister);
  });
  
  return () => {
    unregisterFunctions.forEach(unregister => unregister());
  };
};
