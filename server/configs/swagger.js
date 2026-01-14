/**
 * Swagger/OpenAPI Configuration
 * API documentation setup
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'So Fluent Platform API',
      version: '1.0.0',
      description: 'API documentation for So Fluent English Learning Platform',
      contact: {
        name: 'So Fluent Support',
        email: 'support@sofluent.ai',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.sofluent.ai',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk authentication token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID (Clerk ID)' },
            clerkId: { type: 'string', description: 'Clerk user ID' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['student', 'teacher', 'educator', 'master_admin'] },
            subscriptionTier: { type: 'string', enum: ['free', 'academy', 'vip'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            instructorId: { type: 'string' },
            price: { type: 'number', format: 'float' },
            thumbnailUrl: { type: 'string', format: 'uri' },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './server.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
