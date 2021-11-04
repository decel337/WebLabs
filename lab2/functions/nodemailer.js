const nodemailer = require('nodemailer');

const mailer = (name, message) => {
    const transport = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'left331@gmail.com',
                pass: '123under123',
            },
        },
        {
            from: `Anonymous <left331@gmail.com>`,
        },
    );
    transport.sendMail(message, (err, info) => {
        if (err) return console.log(err);
        console.log('Sent:' + info);
    });
};

module.exports = mailer;
