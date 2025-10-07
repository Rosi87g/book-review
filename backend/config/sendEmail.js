import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your app password
      },
    });

    const mailOptions = {
      from: `"Book Review" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ sendEmail error:', error);
    throw new Error('Email sending failed');
  }
};

export default sendEmail;