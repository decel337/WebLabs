const express = require('express');
const rateLimit = require('express-rate-limit');
const mailer = require('./nodemailer');
const sanitizeHtml = require('sanitize-html');
const app = express();
const PORT = 3001;
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 2,
    skip: req => req.method === 'OPTIONS',
});

app.use('/style.css', express.static(__dirname + '/style.css'));
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use('/sendMes', apiLimiter);

app.post('/sendMes', (req, res) => {
    sanitizeHtml(req.body.name);
    sanitizeHtml(req.body.mail);
    sanitizeHtml(req.body.message);

    if (req.body.mail !== '' && req.body.message !== '') {
        const message = {
            to: req.body.mail,
            subject: 'Anon message',
            text: 'Hello, ' + req.body.name + '\n' + req.body.message,
        };

        mailer(req.body.name, message);
        res.send('Message sent');
    } else {
        res.statusCode = 400;
        res.send('Form validation error!');
    }
});

app.listen(PORT, () => console.log('okey'));
