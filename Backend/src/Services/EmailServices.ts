import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const sendPasswordResetLink = async ( email: string, link: string) => {
  try {
    await transporter.sendMail({
      from: "security@myapp.com",
      to: email,
      subject: "Password Reset",
      html: `<p>Hi <br>You are receiving this email because you requested to reset your password. Please click on <a href="${link}">this link</a> to update your account.</p>`,
    });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    throw new Error("Could not send email");
  }
};

transporter.verify((error: Error | null, success: boolean) => {
  if (error) {
    console.error('Transport configuration error:', error);
  } else {
    console.log('Successful transport configuration:', success);
  }
});

export default {
  sendPasswordResetLink,
};

