import nodemailer from 'nodemailer';

export const sendEmail = async (message = 'dummy message') => {
  try {
    // const testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.host,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.username, // generated ethereal user
        pass: process.env.password, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: 'deepanshugupta2501@gmail.com', // sender address
      to: 'deepanshugupta2501@gmail.com', // list of receivers
      subject: 'Bit Coin Price Alert', // Subject line
      text: message, // plain text body
      html: message, // html body
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(error);
  }
};
