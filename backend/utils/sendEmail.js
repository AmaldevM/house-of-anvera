const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

exports.sendOTPEmail = async (email, otp, name) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"House of Anvera" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email - House of Anvera',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F9F4EE; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1D1D1D; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">HOUSE OF ANVERA</h1>
          <div style="width: 60px; height: 2px; background: #C89B3C; margin: 12px auto;"></div>
        </div>
        <h2 style="color: #473428; font-size: 22px;">Welcome, ${name}!</h2>
        <p style="color: #1D1D1D; font-size: 16px; line-height: 1.6;">Thank you for joining House of Anvera. Please verify your email with the code below:</p>
        <div style="background: #1D1D1D; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="color: #C89B3C; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #473428; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        <div style="margin-top: 40px; border-top: 1px solid #C89B3C; padding-top: 20px; text-align: center;">
          <p style="color: #473428; font-size: 12px;">© 2024 House of Anvera. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

exports.sendOrderConfirmationEmail = async (email, name, order) => {
  const transporter = createTransporter();
  const itemsHtml = order.products.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0d5c8;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0d5c8; text-align:center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0d5c8; text-align:right;">₹${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from: `"House of Anvera" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Order Confirmed #${order._id} - House of Anvera`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F9F4EE; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1D1D1D; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">HOUSE OF ANVERA</h1>
          <div style="width: 60px; height: 2px; background: #C89B3C; margin: 12px auto;"></div>
        </div>
        <h2 style="color: #473428;">Thank you, ${name}!</h2>
        <p style="color: #1D1D1D;">Your order has been confirmed. Here's a summary:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead><tr style="background: #1D1D1D;">
            <th style="color: #C89B3C; padding: 12px; text-align:left;">Item</th>
            <th style="color: #C89B3C; padding: 12px; text-align:center;">Qty</th>
            <th style="color: #C89B3C; padding: 12px; text-align:right;">Price</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr>
            <td colspan="2" style="padding: 12px; font-weight: bold; color: #473428;">Total</td>
            <td style="padding: 12px; font-weight: bold; color: #C89B3C; text-align:right;">₹${order.total.toLocaleString()}</td>
          </tr></tfoot>
        </table>
        <p style="color: #473428;">Payment Method: <strong>${order.paymentMethod}</strong></p>
        <p style="color: #473428;">We'll notify you when your order ships.</p>
        <div style="margin-top: 40px; border-top: 1px solid #C89B3C; padding-top: 20px; text-align: center;">
          <p style="color: #473428; font-size: 12px;">© 2024 House of Anvera. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"House of Anvera" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset - House of Anvera',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F9F4EE; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1D1D1D; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">HOUSE OF ANVERA</h1>
          <div style="width: 60px; height: 2px; background: #C89B3C; margin: 12px auto;"></div>
        </div>
        <h2 style="color: #473428;">Password Reset Request</h2>
        <p style="color: #1D1D1D;">Hi ${name}, click the button below to reset your password. This link expires in 1 hour.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: #C89B3C; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 16px; letter-spacing: 1px;">RESET PASSWORD</a>
        </div>
        <p style="color: #473428; font-size: 14px;">If you didn't request a password reset, ignore this email.</p>
        <div style="margin-top: 40px; border-top: 1px solid #C89B3C; padding-top: 20px; text-align: center;">
          <p style="color: #473428; font-size: 12px;">© 2024 House of Anvera. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

exports.sendShippingUpdateEmail = async (email, name, order) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"House of Anvera" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Your Order Has Shipped! #${order._id} - House of Anvera`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F9F4EE; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1D1D1D; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">HOUSE OF ANVERA</h1>
          <div style="width: 60px; height: 2px; background: #C89B3C; margin: 12px auto;"></div>
        </div>
        <h2 style="color: #473428;">Your order is on its way, ${name}!</h2>
        <p style="color: #1D1D1D;">Your order <strong>#${order._id}</strong> has been shipped.</p>
        ${order.trackingNumber ? `<p style="color: #473428;">Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
        <p style="color: #473428;">Status: <strong>${order.shippingStatus}</strong></p>
        <div style="margin-top: 40px; border-top: 1px solid #C89B3C; padding-top: 20px; text-align: center;">
          <p style="color: #473428; font-size: 12px;">© 2024 House of Anvera. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

exports.sendContactReplyEmail = async (email, name, subject, reply) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"House of Anvera" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Re: ${subject} - House of Anvera`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F9F4EE; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1D1D1D; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">HOUSE OF ANVERA</h1>
          <div style="width: 60px; height: 2px; background: #C89B3C; margin: 12px auto;"></div>
        </div>
        <h2 style="color: #473428;">Hello, ${name}!</h2>
        <p style="color: #1D1D1D; line-height: 1.6;">${reply}</p>
        <div style="margin-top: 40px; border-top: 1px solid #C89B3C; padding-top: 20px; text-align: center;">
          <p style="color: #473428; font-size: 12px;">© 2024 House of Anvera. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};
