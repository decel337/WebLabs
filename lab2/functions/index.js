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
    const currentTime = new Date();

    const infoIP = rateLimit.IP_DATA.get(currentIP) ?? {
        count: 0,
        time: currentTime,
    };

    if (
        infoIP.count &&
        (infoIP.count + 1 > rateLimit.RPS_LIMIT ||
            currentTime - infoIP.time <= rateLimit.TIME_FRAME * 1000)
    ) {
        res.status(429).send();
    }

    infoIP.count += 1;
    infoIP.time = new Date();
    rateLimit.IP_DATA.set(currentIP, infoIP);

    const cleanMes = sanitizeHtml(req.body.message);

    if (req.body.mail !== '' && cleanMes !== '') {
        const message = {
            to: req.body.mail,
            subject: 'Anon message',
            text: 'Hello, ' + req.body.name + '\n' + cleanMes,
        };
        mailer(message);
    } else {
        res.status(400);
    }
    res.send();
});
