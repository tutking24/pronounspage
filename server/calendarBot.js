require('../src/dotenv')();
const Twitter = require('twitter');
const Mastodon = require('mastodon');
const Suml = require('suml');
const fs = require('fs');
const { calendar } = require('../src/calendar/calendar');
const { Day } = require('../src/calendar/helpers');
const locales = require('../src/locales');
const fetch = require('node-fetch');

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
    name = name.replace(/{.*?=(.*?)}/g, '$1')
    return name;
}

const publishers = {
    async twitter(tweet, image) {
        const client = new Twitter({
            consumer_key: process.env.TWITTER_CALENDAR_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CALENDAR_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_CALENDAR_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_CALENDAR_ACCESS_TOKEN_SECRET,
        });

        try {
            const tweetResponse = await client.post('statuses/update', {status: tweet});
            console.log(tweetResponse);
        } catch (error) {
            console.error(error);
        }
    },
    async mastodon(tweet, image) {
        const client = new Mastodon({
            access_token: process.env.MASTODON_ACCESS_TOKEN,
            api_url: `https://${process.env.MASTODON_INSTANCE}/api/v1/`
        });

        const mediaIds = [];
        if (image) {
            try {
                const mediaResponse = await client.post('media', { file: image, description: 'Screenshot of the link above' });
                console.log(mediaResponse);
                mediaIds.push(mediaResponse.data.id);
            } catch (error) {
                console.error(error);
            }
        }

        try {
            const tweetResponse = await client.post('statuses', { status: tweet, media_ids: mediaIds, visibility: 'unlisted' });
            console.log(tweetResponse);
        } catch (error) {
            console.error(error);
        }
    },
};

(async () => {
    const day = Day.today();
    const events = calendar.getCurrentYear().eventsByDate[day.toString()];
    console.log(events);

    if (events === undefined || events.length === 0) {
        return;
    }

    let tweet = `[${language}] ${day.toString()}\n\n${translations.calendar.banner}:\n`;
    for (let event of events) {
        tweet += ` - ${getEventName(event.name)}\n`;
    }
    tweet += `\n${domain}/${encodeURIComponent(config.calendar.route)}/${day}`;

    let image = null;
    try {
        image = fs.createReadStream(`${__dirname}/../static/calendar/${day}.png`);
    } catch {}

    console.log('------------');
    console.log(tweet);
    console.log('------------');

    for (let publisher of process.argv.slice(2)) {
        console.log('Publishing: ' + publisher);
        publishers[publisher](tweet, image);
        console.log('------------');
    }
})();
