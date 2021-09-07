require('../src/dotenv')();

const Pageres = require('pageres');
const fs  = require('fs');
const Suml = require('suml');
const locale = new Suml().parse(fs.readFileSync(`./data/config.suml`).toString()).locale;

const shoot = async (url, filename) => {
    const pr = new Pageres({
        delay: 3,
        scale: 2,
    });
    pr.src(process.env.BASE_URL + url, ['1500x300']);
    for (let buffer of await pr.run()) {
        const target = `${__dirname}/../static/calendar/${filename}.png`;
        console.log(target);
        fs.writeFileSync(target, buffer);
    }
}

(async () => {
    await shoot('/calendar-wide', `calendar-${locale}-overview`);
    await shoot('/calendar-wide?labels=true', `calendar-${locale}-labels`);
})();
