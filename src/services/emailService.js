import nodemailer from 'nodemailer';

/**
 * Service to handle email sending.
 */
class EmailService {
    constructor() {
        this.transporter = null;
    }

    _getTransporter() {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        }
        return this.transporter;
    }

    /**
     * Send an email.
     * @param {Object} options - Email options
     * @param {string} options.to - Recipient email
     * @param {string} options.subject - Email subject
     * @param {string} options.text - Plain text body
     * @param {string} options.html - HTML body
     */
    async sendEmail(options) {
        // In development, if no real creds, just log the email content
        // For development, we just log AND try to send if config exists. 
        // The check below was preventing sending if env vars were present but loaded in a way that this specific check didn't catch 
        // or if the user wanted to use Ethereal defaults which might be hardcoded in constructor.

        const transporter = this._getTransporter();
        console.log(`[EmailService] Attempting to send email to: ${options.to}`);
        console.log(`[EmailService] Using Service: Gmail`);

        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"Krimson Support" <support@krimson.edu>', // sender address
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html
            });

            console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't throw invalid email error to prevent user enumeration or blocking flow
        }
    }

    /**
     * Send password reset email.
     * @param {string} email - Recipient email
     * @param {string} resetUrl - The reset URL
     */
    async sendPasswordReset(email, resetUrl) {
        const message = `
            <h1>Password Reset Request</h1>
            <p>You have requested a password reset for your Krimson OS account.</p>
            <p>Please go to this link to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Krimson OS - Password Reset Token',
            text: `You have requested a password reset. Please go to this link to reset your password: ${resetUrl}`,
            html: message
        });
    }
    /**
     * Send welcome email to new user.
     * @param {string} email 
     * @param {string} password 
     * @param {string} name 
     */
    async sendWelcomeEmail(email, password, name) {
        const message = `
            <h1>Welcome to Krimson OS, ${name}!</h1>
            <p>Your account has been created successfully.</p>
            <p>Here are your login credentials:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
            <p>Please login and change your password immediately.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login">Login to Dashboard</a>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Welcome to Krimson OS - Account Credentials',
            text: `Welcome ${name}! Your password is: ${password}. Please login at ${process.env.FRONTEND_URL}`,
            html: message
        });
    }

    /**
     * Send password reset OTP email.
     * @param {string} email - Recipient email
     * @param {string} otp - The 6-digit OTP
     */
    async sendPasswordResetOTP(email, otp) {
        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Krimson OS - Password Reset</h2>
                <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A90E2; background: #f4f7f6; padding: 10px 20px; border-radius: 5px;">${otp}</span>
                </div>
                <p>This OTP is valid for <strong>24 hours</strong>. If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} Krimson OS. All rights reserved.</p>
            </div>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Krimson OS - Your Password Reset OTP',
            text: `Your password reset OTP is: ${otp}. It is valid for 24 hours.`,
            html: message
        });
    }
}


export default new EmailService();
