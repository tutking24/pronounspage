require('../src/dotenv')();
const Twitter = require('twitter');
const Suml = require('suml');
const fs = require('fs');
const { currentYear } = require('../src/calendar/calendar');
const { Day } = require('../src/calendar/helpers');
const locales = require('../src/locales');

const loadSuml = name => new Suml().parse(fs.readFileSync(`${__dirname}/../data/${name}.suml`).toString());
const translations = loadSuml('translations');
const config = loadSuml('config');

let domain = null;
let language = null;
for (let [code, name, url, ] of locales) {
    if (code === config.locale) {
        domain = url;
        language = name;
    }
}

const getEventName = (name) => {
    name = translations.calendar.events[name] || name;
    name = name.replace(/{.*?=(.*)}/g, '$1')
    return name;
}

(async () => {
    const day = Day.today();
    const events = currentYear.eventsByDate[day.toString()];
    console.log(events);

    if (events === undefined || events.length === 0) {
        return;
    }

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CALENDAR_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CALENDAR_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_CALENDAR_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_CALENDAR_ACCESS_TOKEN_SECRET,
    });

    let tweet = `[${language}] ${day.toString()}\n\n${translations.calendar.banner}:\n`;
    for (let event of events) {
        tweet += ` - ${getEventName(event.name)}\n`;
    }
    tweet += `\n${domain}/${config.calendar.route}`;

    console.log('------------');
    console.log(tweet);
    console.log('------------');

    try {
        const tweetResponse = await client.post('statuses/update', {status: tweet});
        console.log(tweetResponse);
    } catch (error) {
        console.error(error);
    }
})();
