require('../src/dotenv')();

const Pageres = require('pageres');
const fs  = require('fs');

const shoot = async (url, filename) => {
    const pr = new Pageres({
        delay: 3,
        scale: 2,
    });
    pr.src(process.env.BASE_URL + url, ['1500x300']);
    for (let buffer of await pr.run()) {
        const dir = `${__dirname}/../static/img-local/calendar`;
        fs.mkdirSync(dir, {recursive: true})
        const target = `${dir}/${filename}.png`;
        console.log(target);
        fs.writeFileSync(target, buffer);
    }
}

(async () => {
    await shoot('/calendar-wide', `overview`);
    await shoot('/calendar-wide?labels=true', `labels`);
})();
