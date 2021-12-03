const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

const mailer = message => {
    const configSecret = functions.config()?.s;
    const transport = nodemailer.createTransport(
        {
            host: configSecret?.host,
            port: configSecret?.port,
            auth: {
                user: configSecret?.mail,
                pass: configSecret?.pass,
            },
        },
        {
            from: 'Anonymous <' + configSecret?.mail + '>',
        },
    );
    if (!message) {
        throw message;
    }
    transport.sendMail(message, (err, info) => {
        if (err) throw err;
        return info;
    });
};

module.exports = mailer;
