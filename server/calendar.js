require('dotenv').config({ path:__dirname + '/../.env' });
const Pageres = require('pageres');
const fs  = require('fs');
const Suml = require('suml');
const locale = new Suml().parse(fs.readFileSync(`./data/config.suml`).toString()).locale;

(async () => {
    const pr = new Pageres({
        delay: 3,
    });
    pr.src(process.env.BASE_URL + '/calendar-wide', ['1500x300']);

    for (let buffer of await pr.run()) {
        const target = `${__dirname}/../static/calendar/calendar-${locale}.png`;
        console.log(target);
        fs.writeFileSync(target, buffer);
    }
})();
