import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Cambia esto con el host de tu proveedor de correo
  port: 465,
  secure: true, // true para port 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASSWORD, // Tu contraseña de correo
  },
});

transporter.verify().then(() => {
    console.log('ready for send emails');
});

// export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
//   const mailOptions = {
//     from: "yo",
//     to,
//     subject,
//     text,
//     html,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };
