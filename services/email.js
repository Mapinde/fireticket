const nodemailer = require('nodemailer');

const sendMailService = {

    sendMailer: async (email, text, htmltxt) => {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'onelio.mapinde@gmail.com',
                pass: 'Luc!fer1'
            }
        });

        const mailOptions = {
            from: 'onelio.mapinde@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'FireTicket - '+text, // Subject line
            html: htmltxt// plain text body
        };

        await transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                console.log(err)
            }
            else{
                console.log(info)
            }
        });
    }
};

module.exports= sendMailService;