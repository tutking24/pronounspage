require('../src/dotenv')();

const Pageres = require('pageres');
const fs  = require('fs');
const dbConnection = require('./db');
const Suml = require('suml');
const { calendar } = require('../src/calendar/calendar');
const md5 = require('js-md5');

const loadSuml = name => new Suml().parse(fs.readFileSync(`${__dirname}/../data/${name}.suml`).toString());
const config = loadSuml('config');

const dir = `${__dirname}/../static/calendar`;

const force = process.argv[2] === '-f' || process.argv[2] === '--force'

const shoot = async (url, filename) => {
    const pr = new Pageres({
        delay: 3,
        scale: 2,
    });
    pr.src(process.env.BASE_URL + url, ['1500x300']);
    for (let buffer of await pr.run()) {
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
    const prevPath = `${__dirname}/../cache/calendar.json`
    const prev = fs.existsSync(prevPath) ? JSON.parse(fs.readFileSync(prevPath)) : {};

    const current = calendar.buildSummary();
    const changedYears = new Set();
    for (let day in current) {
        if (!current.hasOwnProperty(day)) { continue; }
        const year = day.substring(0, 4);
        if (current[day] !== prev[day] || !fs.existsSync(`${dir}/${day}.png`) || force) {
            await shoot(`/${config.calendar.route}/${day}?layout=basic`, `${day}`);
            changedYears.add(year);
        }
        if (!fs.existsSync(`${dir}/${year}-overview.png`) || !fs.existsSync(`${dir}/${year}-labels.png`) || force) {
            changedYears.add(year);
        }
    }

    for (let year of changedYears) {
        await shoot(`/${config.calendar.route}/${year}?layout=basic`, `${year}-overview`);
        await shoot(`/${config.calendar.route}/${year}?layout=basic&labels=true`, `${year}-labels`);
    }

    fs.writeFileSync(prevPath, JSON.stringify(current, null, 4));

    await dumpNameDays();
})();
