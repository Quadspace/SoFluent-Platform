/**
 * Google Classroom Service
 * Handles all Google Classroom API operations
 * Ensures courses, students, and assignments sync automatically
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class GoogleClassroomService {
  constructor() {
    this.classroom = null;
    this.oauth2Client = null;
    this.initializeAuth();
  }

  /**
   * Initialize OAuth2 client for Google APIs
   */
  initializeAuth() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback'
    );

    // If using service account (for domain-wide delegation)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      this.oauth2Client = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        [
          'https://www.googleapis.com/auth/classroom.courses',
          'https://www.googleapis.com/auth/classroom.rosters',
          'https://www.googleapis.com/auth/classroom.coursework.me',
          'https://www.googleapis.com/auth/classroom.coursework.students'
        ],
        process.env.GOOGLE_SUBJECT_EMAIL // Admin email for domain-wide delegation
      );
    }

    this.classroom = google.classroom({
      version: 'v1',
      auth: this.oauth2Client
    });
  }

  /**
   * Set access token for user-specific operations
   */
  setAccessToken(accessToken) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
  }

  /**
   * Create a Google Classroom course when teacher creates a cohort
   * @param {string} teacherId - Teacher's Google email
   * @param {string} courseName - Course name
   * @param {string} description - Course description
   * @param {string} section - Course section (optional)
   * @returns {Promise<Object>} Created course object
   */
  async createCourse(teacherId, courseName, description, section = null) {
    try {
      const course = await this.classroom.courses.create({
        requestBody: {
          name: courseName,
          description: description,
          ownerId: teacherId,
          courseState: 'ACTIVE',
          section: section,
          room: 'So Fluent Platform'
        }
      });

      return {
        success: true,
        courseId: course.data.id,
        course: course.data
      };
    } catch (error) {
      throw new Error(`Failed to create Google Classroom course: ${error.message}`);
    }
  }

  /**
   * Enroll a student in a Google Classroom course
   * @param {string} courseId - Google Classroom course ID
   * @param {string} studentEmail - Student's email address
   * @returns {Promise<Object>} Enrollment result
   */
  async enrollStudent(courseId, studentEmail) {
    try {
      const student = await this.classroom.courses.students.create({
        courseId: courseId,
        requestBody: {
          userId: studentEmail
        }
      });

      return {
        success: true,
        student: student.data
      };
    } catch (error) {
      // Student might already be enrolled
      if (error.code === 409) {
        return {
          success: true,
          message: 'Student already enrolled',
          student: null
        };
      }
      throw new Error(`Failed to enroll student: ${error.message}`);
    }
  }

  /**
   * Create an assignment in Google Classroom
   * @param {string} courseId - Google Classroom course ID
   * @param {string} title - Assignment title
   * @param {string} description - Assignment description
   * @param {Date} dueDate - Due date
   * @param {number} maxPoints - Maximum points (optional)
   * @returns {Promise<Object>} Created assignment
   */
  async createAssignment(courseId, title, description, dueDate, maxPoints = 100) {
    try {
      const assignment = await this.classroom.courses.courseWork.create({
        courseId: courseId,
        requestBody: {
          title: title,
          description: description,
          workType: 'ASSIGNMENT',
          state: 'PUBLISHED',
          dueDate: {
            year: dueDate.getFullYear(),
            month: dueDate.getMonth() + 1,
            day: dueDate.getDate()
          },
          dueTime: {
            hours: dueDate.getHours(),
            minutes: dueDate.getMinutes()
          },
          maxPoints: maxPoints
        }
      });

      return {
        success: true,
        assignmentId: assignment.data.id,
        assignment: assignment.data
      };
    } catch (error) {
      throw new Error(`Failed to create assignment: ${error.message}`);
    }
  }

  /**
   * Get student progress/submissions for a course
   * @param {string} courseId - Google Classroom course ID
   * @param {string} studentId - Student's email or ID
   * @returns {Promise<Array>} List of submissions
   */
  async getStudentProgress(courseId, studentId) {
    try {
      // Get all course work
      const courseWork = await this.classroom.courses.courseWork.list({
        courseId: courseId
      });

      const submissions = [];
      
      // Get submissions for each assignment
      for (const work of courseWork.data.courseWork || []) {
        try {
          const submission = await this.classroom.courses.courseWork.studentSubmissions.list({
            courseId: courseId,
            courseWorkId: work.id,
            userId: studentId
          });
          
          if (submission.data.studentSubmissions) {
            submissions.push(...submission.data.studentSubmissions);
          }
        } catch (error) {
          // Continue if submission doesn't exist
        }
      }

      return {
        success: true,
        submissions: submissions
      };
    } catch (error) {
      throw new Error(`Failed to get student progress: ${error.message}`);
    }
  }

  /**
   * Get course details
   * @param {string} courseId - Google Classroom course ID
   * @returns {Promise<Object>} Course details
   */
  async getCourse(courseId) {
    try {
      const course = await this.classroom.courses.get({
        id: courseId
      });

      return {
        success: true,
        course: course.data
      };
    } catch (error) {
      throw new Error(`Failed to get course: ${error.message}`);
    }
  }

  /**
   * List all courses for a teacher
   * @param {string} teacherId - Teacher's email
   * @returns {Promise<Array>} List of courses
   */
  async listTeacherCourses(teacherId) {
    try {
      const courses = await this.classroom.courses.list({
        teacherId: teacherId,
        courseStates: ['ACTIVE']
      });

      return {
        success: true,
        courses: courses.data.courses || []
      };
    } catch (error) {
      throw new Error(`Failed to list courses: ${error.message}`);
    }
  }

  /**
   * Get course students
   * @param {string} courseId - Google Classroom course ID
   * @returns {Promise<Array>} List of students
   */
  async getCourseStudents(courseId) {
    try {
      const students = await this.classroom.courses.students.list({
        courseId: courseId
      });

      return {
        success: true,
        students: students.data.students || []
      };
    } catch (error) {
      throw new Error(`Failed to get course students: ${error.message}`);
    }
  }

  /**
   * Sync So Fluent course with Google Classroom
   * Creates course, enrolls students, creates assignments
   * @param {Object} soFluentCourse - So Fluent course object
   * @param {string} teacherEmail - Teacher's email
   * @returns {Promise<Object>} Sync result
   */
  async syncCourse(soFluentCourse, teacherEmail) {
    try {
      // 1. Create Google Classroom course
      const courseResult = await this.createCourse(
        teacherEmail,
        soFluentCourse.name,
        soFluentCourse.description,
        soFluentCourse.section
      );

      const courseId = courseResult.courseId;

      // 2. Enroll all students
      const enrollmentResults = [];
      if (soFluentCourse.students && soFluentCourse.students.length > 0) {
        for (const student of soFluentCourse.students) {
          try {
            const enrollment = await this.enrollStudent(courseId, student.email);
            enrollmentResults.push({
              student: student.email,
              success: enrollment.success
            });
          } catch (error) {
            enrollmentResults.push({
              student: student.email,
              success: false,
              error: error.message
            });
          }
        }
      }

      // 3. Create assignments from lessons
      const assignmentResults = [];
      if (soFluentCourse.lessons && soFluentCourse.lessons.length > 0) {
        for (const lesson of soFluentCourse.lessons) {
          if (lesson.isAssignment && lesson.dueDate) {
            try {
              const assignment = await this.createAssignment(
                courseId,
                lesson.title,
                lesson.description,
                new Date(lesson.dueDate),
                lesson.points || 100
              );
              assignmentResults.push({
                lesson: lesson.title,
                success: true,
                assignmentId: assignment.assignmentId
              });
            } catch (error) {
              assignmentResults.push({
                lesson: lesson.title,
                success: false,
                error: error.message
              });
            }
          }
        }
      }

      return {
        success: true,
        courseId: courseId,
        enrollments: enrollmentResults,
        assignments: assignmentResults
      };
    } catch (error) {
      throw new Error(`Failed to sync course: ${error.message}`);
    }
  }
}

export default new GoogleClassroomService();
