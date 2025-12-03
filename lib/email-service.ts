import nodemailer from 'nodemailer'

// Zoho Mail Configuration
// IMPORTANT: You need to generate an App Password from Zoho Mail
// Steps:
// 1. Login to Zoho Mail
// 2. Go to Settings > Security > App Passwords
// 3. Generate new App Password for "Whitlin E-commerce"
// 4. Replace the pass below with your App Password

// Option 1: SSL Configuration (Port 465)
const ZOHO_CONFIG_SSL = {
  host: 'smtp.zoho.in',
  port: 465, // SSL port
  secure: true, // true for SSL
  auth: {
    user: 'info@whitlin.com',
    pass: 'Ad34%@hRFd' // Replace with your Zoho App Password
  }
}

// Option 2: TLS Configuration (Port 587) - Currently using this
const ZOHO_CONFIG = {
  host: 'smtp.zoho.in',
  port: 587, // TLS port
  secure: false, // false for TLS
  auth: {
    user: 'info@whitlin.com',
    pass: 'Ad34%@hRFd' // Replace with your Zoho App Password
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
}

// Admin email for notifications
const ADMIN_EMAIL = 'info@whitlin.com'

// Create transporter - Using SSL configuration (Port 465)
const createTransporter = () => {
  return nodemailer.createTransport(ZOHO_CONFIG_SSL)
}

// Email templates
export const emailTemplates = {
  newUserRegistration: (userData: {
    name: string
    email: string
    phone?: string
    registrationDate: string
  }) => ({
    subject: `🎉 New User Registration - ${userData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #d4af37, #b8941f);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .user-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #d4af37;
          }
          .info-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
          }
          .label {
            font-weight: bold;
            color: #666;
          }
          .value {
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
          .action-button {
            display: inline-block;
            background: #d4af37;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 New User Registration</h1>
          <p>Whitlin E-commerce Platform</p>
        </div>
        
        <div class="content">
          <h2>Hello Admin!</h2>
          <p>A new user has registered on your Whitlin platform. Here are the details:</p>
          
          <div class="user-info">
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${userData.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${userData.email}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${userData.phone || 'Not provided'}</span>
            </div>
            <div class="info-row">
              <span class="label">Registration Date:</span>
              <span class="value">${userData.registrationDate}</span>
            </div>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the user profile in admin panel</li>
            <li>Send welcome email to the new user</li>
            <li>Monitor their activity and engagement</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="http://localhost:3000/admin/users" class="action-button">
              View in Admin Panel
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from Whitlin E-commerce Platform</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `,
    text: `
      New User Registration - Whitlin Platform
      
      A new user has registered on your platform:
      
      Name: ${userData.name}
      Email: ${userData.email}
      Phone: ${userData.phone || 'Not provided'}
      Registration Date: ${userData.registrationDate}
      
      Please review the user profile in your admin panel.
      
      Generated on ${new Date().toLocaleString()}
    `
  }),

  welcomeEmail: (userData: {
    name: string
    email: string
  }) => ({
    subject: `Welcome to Whitlin - ${userData.name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #d4af37, #b8941f);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .welcome-message {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          .feature {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #f0f0f0;
          }
          .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .action-button {
            display: inline-block;
            background: #d4af37;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌟 Welcome to Whitlin!</h1>
          <p>Professional Hair Care Solutions</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <h2>Hello ${userData.name}!</h2>
            <p>Welcome to Whitlin - your premium destination for professional hair care products!</p>
            <p>We're excited to have you join our community of hair care enthusiasts.</p>
          </div>
          
          <h3>What you can do now:</h3>
          <div class="features">
            <div class="feature">
              <div class="feature-icon">🛍️</div>
              <h4>Shop Products</h4>
              <p>Browse our premium hair care collection</p>
            </div>
            <div class="feature">
              <div class="feature-icon">💝</div>
              <h4>Add to Wishlist</h4>
              <p>Save your favorite products for later</p>
            </div>
            <div class="feature">
              <div class="feature-icon">📦</div>
              <h4>Track Orders</h4>
              <p>Monitor your order status in real-time</p>
            </div>
            <div class="feature">
              <div class="feature-icon">⭐</div>
              <h4>Leave Reviews</h4>
              <p>Share your experience with others</p>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="http://localhost:3000/products" class="action-button">
              Start Shopping Now
            </a>
          </div>
          
          <p><strong>Special Offer:</strong> Get 10% off your first order! Use code: <strong>WELCOME10</strong></p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Whitlin!</p>
          <p>If you have any questions, feel free to contact us.</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Whitlin!
      
      Hello ${userData.name}!
      
      Welcome to Whitlin - your premium destination for professional hair care products!
      We're excited to have you join our community of hair care enthusiasts.
      
      What you can do now:
      - Shop Products: Browse our premium hair care collection
      - Add to Wishlist: Save your favorite products for later
      - Track Orders: Monitor your order status in real-time
      - Leave Reviews: Share your experience with others
      
      Special Offer: Get 10% off your first order! Use code: WELCOME10
      
      Start shopping at: http://localhost:3000/products
      
      Thank you for choosing Whitlin!
      Generated on ${new Date().toLocaleString()}
    `
  }),

  forgotPassword: (userData: {
    name: string
    email: string
    otp: string
  }) => ({
    subject: `🔐 Password Reset OTP - Whitlin`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #d4af37, #b8941f);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .otp-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            border: 2px solid #d4af37;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #d4af37;
            letter-spacing: 8px;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 2px dashed #d4af37;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
          .security-tips {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .security-tips h3 {
            color: #d4af37;
            margin-top: 0;
          }
          .security-tips ul {
            margin: 10px 0;
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset</h1>
          <p>Whitlin E-commerce Platform</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userData.name}!</h2>
          <p>We received a request to reset your password for your Whitlin account.</p>
          
          <div class="otp-container">
            <h3>Your Password Reset OTP</h3>
            <div class="otp-code">${userData.otp}</div>
            <p><strong>This OTP will expire in 10 minutes</strong></p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important Security Information:</strong>
            <ul>
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>Whitlin will never ask for your OTP via phone or email</li>
            </ul>
          </div>
          
          <div class="security-tips">
            <h3>🔒 Security Tips:</h3>
            <ul>
              <li>Use a strong, unique password</li>
              <li>Never reuse passwords from other accounts</li>
              <li>Enable two-factor authentication if available</li>
              <li>Log out from shared devices</li>
            </ul>
          </div>
          
          <p>If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated security email from Whitlin</p>
          <p>For support, contact us at support@whitlin.com</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset OTP - Whitlin
      
      Hello ${userData.name}!
      
      We received a request to reset your password for your Whitlin account.
      
      Your Password Reset OTP: ${userData.otp}
      
      This OTP will expire in 10 minutes.
      
      IMPORTANT SECURITY INFORMATION:
      - This OTP is valid for 10 minutes only
      - Do not share this OTP with anyone
      - Whitlin will never ask for your OTP via phone or email
      
      SECURITY TIPS:
      - Use a strong, unique password
      - Never reuse passwords from other accounts
      - Enable two-factor authentication if available
      - Log out from shared devices
      
      If you didn't request this password reset, please ignore this email or contact our support team immediately.
      
      For support, contact us at support@whitlin.com
      Generated on ${new Date().toLocaleString()}
    `
  })
}

// Send email function
export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"Whitlin Admin" <${ZOHO_CONFIG.auth.user}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// Send new user registration notification to admin
export const sendNewUserNotification = async (userData: {
  name: string
  email: string
  phone?: string
  registrationDate: string
}) => {
  const template = emailTemplates.newUserRegistration(userData)
  return await sendEmail(ADMIN_EMAIL, template.subject, template.html, template.text)
}

// Send welcome email to new user
export const sendWelcomeEmail = async (userData: {
  name: string
  email: string
}) => {
  const template = emailTemplates.welcomeEmail(userData)
  return await sendEmail(userData.email, template.subject, template.html, template.text)
}

// Send forgot password OTP email
export const sendForgotPasswordEmail = async (userData: {
  name: string
  email: string
  otp: string
}) => {
  const template = emailTemplates.forgotPassword(userData)
  return await sendEmail(userData.email, template.subject, template.html, template.text)
}

// Newsletter email function
export const sendNewsletterEmail = async ({ 
  to, 
  subject, 
  htmlContent, 
  newsletterId, 
  subscriberId 
}: { 
  to: string; 
  subject: string; 
  htmlContent: string; 
  newsletterId: string; 
  subscriberId: string; 
}) => {
  // Add tracking pixel and unsubscribe link to HTML content
  const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/newsletter/track/open?newsletter=${newsletterId}&subscriber=${subscriberId}" width="1" height="1" style="display:none;" />`
  
  const unsubscribeLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/newsletter/unsubscribe?token=UNSUBSCRIBE_TOKEN`
  
  // Replace UNSUBSCRIBE_TOKEN with actual token (this would be done in the calling function)
  const finalHtmlContent = htmlContent
    .replace('</body>', `${trackingPixel}</body>`)
    .replace(/UNSUBSCRIBE_TOKEN/g, 'UNSUBSCRIBE_TOKEN') // This would be replaced with actual token

  return await sendEmail({
    to,
    subject,
    html: finalHtmlContent,
    text: `View this email in your browser: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/newsletter/${newsletterId}`
  })
}

// Account creation email function
export const sendAccountCreatedEmail = async ({ 
  name, 
  email, 
  password, 
  orderNumber 
}: { 
  name: string; 
  email: string; 
  password: string; 
  orderNumber: string; 
}) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Created - Whitlin Pro</title>
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .account-box { background: #fef3c7; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border: 2px dashed #f59e0b; }
        .password-box { background: #f59e0b; color: white; padding: 15px 25px; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 15px 0; display: inline-block; letter-spacing: 2px; }
        .order-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .security-notice { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .unsubscribe { margin-top: 20px; }
        .unsubscribe a { color: #f59e0b; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">Welcome to Whitlin Pro!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your Account Has Been Created</p>
        </div>
        <div class="content">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your order! We've automatically created your Whitlin Pro account 
            so you can track your order and enjoy future shopping with us.
          </p>
          
          <div class="order-box">
            <h3 style="color: #333; margin: 0 0 15px 0;">📦 Your Order Details</h3>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              <strong>Order Number:</strong> ${orderNumber}<br>
              <strong>Status:</strong> Processing<br>
              You can track your order status by logging into your account.
            </p>
          </div>

          <div class="account-box">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">🔐 Your Account Credentials</h3>
            <p style="color: #92400e; margin: 0 0 15px 0;">Use these details to login to your account:</p>
            <div style="margin: 20px 0;">
              <p style="color: #92400e; margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="color: #92400e; margin: 0 0 15px 0;"><strong>Password:</strong></p>
              <div class="password-box">${password}</div>
            </div>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login" class="button">
              Login to Your Account
            </a>
          </div>

          <div class="security-notice">
            <h3 style="color: #dc2626; margin: 0 0 10px 0;">🔒 Security Notice</h3>
            <ul style="color: #dc2626; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Please change your password after your first login</li>
              <li>Keep your login credentials secure and private</li>
              <li>Never share your password with anyone</li>
              <li>Our team will never ask for your password</li>
            </ul>
          </div>

          <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #0369a1; margin: 0 0 10px 0;">🎉 What's Next?</h3>
            <ul style="color: #0369a1; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Track your order status in real-time</li>
              <li>Access your order history anytime</li>
              <li>Get exclusive member discounts</li>
              <li>Receive personalized product recommendations</li>
            </ul>
          </div>

          <p style="color: #666; line-height: 1.6; text-align: center;">
            Questions about your order or account? Our customer service team is here to help!
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">© 2025 Whitlin Pro. All rights reserved.</p>
          <div class="unsubscribe">
            <a href="mailto:support@whitlin.com">Contact Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
    Welcome to Whitlin Pro!
    
    Hello ${name}!
    
    Thank you for your order! We've automatically created your Whitlin Pro account 
    so you can track your order and enjoy future shopping with us.
    
    📦 Your Order Details
    Order Number: ${orderNumber}
    Status: Processing
    You can track your order status by logging into your account.
    
    🔐 Your Account Credentials
    Email: ${email}
    Password: ${password}
    
    Login to your account: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login
    
    🔒 Security Notice
    - Please change your password after your first login
    - Keep your login credentials secure and private
    - Never share your password with anyone
    - Our team will never ask for your password
    
    🎉 What's Next?
    - Track your order status in real-time
    - Access your order history anytime
    - Get exclusive member discounts
    - Receive personalized product recommendations
    
    Questions about your order or account? Our customer service team is here to help!
    
    © 2025 Whitlin Pro. All rights reserved.
    Contact Support: support@whitlin.com
  `

  return await sendEmail({
    to: email,
    subject: 'Your Whitlin Pro Account Has Been Created - Order Confirmation',
    html: htmlContent,
    text: textContent
  })
}

// Test email function
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email server connection verified successfully')
    return { success: true, message: 'Email server connection verified' }
  } catch (error) {
    console.error('Email server connection failed:', error)
    return { success: false, error: error.message }
  }
}
