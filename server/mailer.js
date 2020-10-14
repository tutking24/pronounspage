const mailer = require('mailer');

module.exports = (to, subject, body) => {
    mailer.send({
        host: process.env.MAILER_HOST,
        port: parseInt(process.env.MAILER_PORT),
        ssl: parseInt(process.env.MAILER_PORT) === 465,
        authentication: 'login',
        username: process.env.MAILER_USER,
        password: process.env.MAILER_PASS,
        from: process.env.MAILER_FROM,
        to,
        subject,
        body,
    },
    function(err){
        if (err) {
            console.error(err);
        }
    });
}
