// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    send: (to, subject, text, html) => {
        const msg = {
            to: 'DanielKRing1@gmail.com',
            from: 'DanielKRing1@gmail.com',
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html
          };
          sgMail.send(msg);
    }
}




// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'DanielKRing1@gmail.com',
//         pass: 'KaiFang3'
//     }
//   });
  
// const mailOptions = {
//     from: 'DanielKRing1@gmail.com',
//     // to: 'DanielKRing1@gmail.com',
//     // subject: 'Sending Email using Node.js',
//     // text: 'That was easy!'
//  };  

//  module.exports = {
//     send: async(to, subject, text) => {
//         const message = {
//             ...mailOptions,
//             to,
//             subject,
//             text
//         };

//         try {
//             const res = await transporter.sendMail(message);
//             console.log(res);
//         }catch(err) {
//             console.log(err);
//             throw new Error(err);
//         }
//     }
// }