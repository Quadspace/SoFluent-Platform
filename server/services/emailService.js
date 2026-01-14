/**
 * Email Service
 * Handles all email sending functionality
 */

import axios from 'axios';

class EmailService {
  constructor() {
    // Secrets managed through Manus Secret Manager in production
    this.apiKey = process.env.EMAIL_SERVICE_API_KEY;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@sofluent.ai';
    this.service = process.env.EMAIL_SERVICE || 'sendgrid'; // sendgrid, ses, mailgun
    
    // Service-specific configurations
    this.sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
    this.sesRegion = process.env.AWS_REGION || 'us-east-1';
  }

  /**
   * Send email using configured service
   */
  async sendEmail({ to, subject, html, text, templateId, templateData }) {
    if (!this.apiKey) {
      console.warn('Email service not configured. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      switch (this.service.toLowerCase()) {
        case 'sendgrid':
          return await this.sendViaSendGrid({ to, subject, html, text, templateId, templateData });
        case 'ses':
          return await this.sendViaSES({ to, subject, html, text });
        case 'mailgun':
          return await this.sendViaMailgun({ to, subject, html, text });
        default:
          throw new Error(`Unsupported email service: ${this.service}`);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send via SendGrid
   */
  async sendViaSendGrid({ to, subject, html, text, templateId, templateData }) {
    const payload = {
      from: { email: this.fromEmail, name: 'So Fluent' },
      personalizations: [{
        to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
        dynamic_template_data: templateData || {},
      }],
    };

    if (templateId) {
      payload.template_id = templateId;
    } else {
      payload.subject = subject;
      payload.content = [
        { type: 'text/plain', value: text || html.replace(/<[^>]*>/g, '') },
        { type: 'text/html', value: html },
      ];
    }

    const response = await axios.post(this.sendgridUrl, payload, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return { success: true, messageId: response.headers['x-message-id'] };
  }

  /**
   * Send via AWS SES
   */
  async sendViaSES({ to, subject, html, text }) {
    // AWS SES implementation would go here
    // Requires AWS SDK
    throw new Error('AWS SES not yet implemented');
  }

  /**
   * Send via Mailgun
   */
  async sendViaMailgun({ to, subject, html, text }) {
    const domain = process.env.MAILGUN_DOMAIN;
    const url = `https://api.mailgun.net/v3/${domain}/messages`;

    const formData = new URLSearchParams();
    formData.append('from', `So Fluent <${this.fromEmail}>`);
    formData.append('to', Array.isArray(to) ? to.join(',') : to);
    formData.append('subject', subject);
    formData.append('text', text || html.replace(/<[^>]*>/g, ''));
    formData.append('html', html);

    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
      },
    });

    return { success: true, messageId: response.data.id };
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #E91E63; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to So Fluent!</h1>
            </div>
            <div class="content">
              <p>Hi ${user.fullName || user.email},</p>
              <p>Welcome to So Fluent! We're excited to have you join our community of ambitious Brazilians transforming their careers.</p>
              <p>Get started by:</p>
              <ul>
                <li>Completing your profile</li>
                <li>Exploring our courses</li>
                <li>Joining your first class</li>
              </ul>
              <a href="${process.env.FRONTEND_URL || 'https://sofluent.ai'}/dashboard" class="button">Go to Dashboard</a>
              <p>Be yourself in English. Prosper globally.</p>
              <p>— The So Fluent Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Welcome to So Fluent! 🎉',
      html,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'https://sofluent.ai'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #E91E63; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hi ${user.fullName || user.email},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p class="warning">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
              <p>— The So Fluent Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Reset Your So Fluent Password',
      html,
    });
  }

  /**
   * Send course enrollment email
   */
  async sendCourseEnrollmentEmail(user, course) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #E91E63; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .course-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Enrolled! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${user.fullName || user.email},</p>
              <p>Congratulations! You've successfully enrolled in:</p>
              <div class="course-card">
                <h2>${course.title}</h2>
                <p>${course.description || 'Start your learning journey today!'}</p>
              </div>
              <a href="${process.env.FRONTEND_URL || 'https://sofluent.ai'}/player/${course._id || course.id}" class="button">Start Learning</a>
              <p>Happy learning!</p>
              <p>— The So Fluent Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: `Welcome to ${course.title}!`,
      html,
    });
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmationEmail(user, payment) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #E91E63; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Confirmed ✅</h1>
            </div>
            <div class="content">
              <p>Hi ${user.fullName || user.email},</p>
              <p>Your payment has been successfully processed!</p>
              <div class="payment-details">
                <p><strong>Amount:</strong> <span class="amount">${payment.currency || 'R$'} ${payment.amount.toFixed(2)}</span></p>
                <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
                <p><strong>Transaction ID:</strong> ${payment.paymentId}</p>
              </div>
              <p>Thank you for your purchase!</p>
              <p>— The So Fluent Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Payment Confirmed - So Fluent',
      html,
    });
  }
}

export default new EmailService();
