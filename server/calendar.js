require('../src/dotenv')();

const Pageres = require('pageres');
const fs  = require('fs');
const dbConnection = require('./db');
const Suml = require('suml');

const loadSuml = name => new Suml().parse(fs.readFileSync(`./data/${name}.suml`).toString());
const config = loadSuml('config');

const shoot = async (url, filename) => {
    const pr = new Pageres({
        delay: 3,
        scale: 2,
    });
    pr.src(process.env.BASE_URL + url, ['1500x300']);
    for (let buffer of await pr.run()) {
        const dir = `${__dirname}/../static/calendar`;
        fs.mkdirSync(dir, {recursive: true})
        const target = `${dir}/${filename}.png`;
        console.log(target);
        fs.writeFileSync(target, buffer);
    }
}

const dumpNameDays = async () => {
    if (!config.names || !config.names.enabled || !config.names.namedays) {
        return;
    }
    const db = await dbConnection();
    const names = await db.all(`
        SELECT n.name, n.namedays
        FROM names n
        WHERE n.namedays IS NOT NULL
          AND approved = 1
          AND deleted = 0
    `);
    const output = {};
    for (let {name, namedays} of names) {
        output[name] = namedays.split('|');
    }
    fs.writeFileSync(`${__dirname}/../data/names/namedays.json`, JSON.stringify(output));
}

(async () => {
    await shoot('/calendar-wide', `overview`);
    await shoot('/calendar-wide?labels=true', `labels`);
    await dumpNameDays();
})();
