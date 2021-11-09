const functions = require('firebase-functions');
const mailer = require('./nodemailer');
const sanitizeHtml = require('sanitize-html');

const rateLimit = {
    RPS_LIMIT: 3,
    TIME_FRAME: 30,
    IP_DATA: new Map(),
};

exports.sendMes = functions.https.onRequest(async (req, res) => {
    const currentIP = req.headers['fastly-client-ip'];
    let infoIP = {};
    const currentTime = new Date();

    infoIP = rateLimit.IP_DATA.get(currentIP);

    if (!infoIP) {
        infoIP = { count: 0, time: currentTime };
    } else if (
        infoIP.count &&
        (infoIP.count + 1 > rateLimit.RPS_LIMIT ||
            currentTime - infoIP.time <= rateLimit.TIME_FRAME * 1000)
    ) {
        res.statusCode = 429;
        res.send('Too many request. Please, wait.');
        return;
    }

    infoIP.count += 1;
    infoIP.time = new Date();
    rateLimit.IP_DATA.set(currentIP, infoIP);

    const name = sanitizeHtml(req.body.name);
    const mail = sanitizeHtml(req.body.mail);
    const mes = sanitizeHtml(req.body.message);

    if (mail !== '' && mes !== '') {
        const message = {
            to: mail,
            subject: 'Anon message',
            text: 'Hello, ' + name + '\n' + mes,
        };
        mailer(message);
        res.send('Message sent');
    } else {
        res.statusCode = 400;
        res.send('Error');
    }
});
