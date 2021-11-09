const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

const mailer = message => {
    const transport = nodemailer.createTransport(
        {
            host: functions.config().s.host,
            port: functions.config().s.port,
            auth: {
                user: functions.config().s.mail,
                pass: functions.config().s.pass,
            },
        },
        {
            from: 'Anonymous <' + functions.config().s.mail + '>',
        },
    );
    transport.sendMail(message, (err, info) => {
        if (err) return err;
        return info;
    });
};

module.exports = mailer;
