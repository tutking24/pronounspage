require('../src/dotenv')();
const Twitter = require('twitter');
const Mastodon = require('mastodon');
const fetch = require('node-fetch');
const fs = require('fs');
const buildLocaleList = require('../src/buildLocaleList');

const locales = buildLocaleList('_');

const publishers = {
    async twitter(tweet, image, previousId) {
        const client = new Twitter({
            consumer_key: process.env.TWITTER_CALENDAR_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CALENDAR_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_CALENDAR_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_CALENDAR_ACCESS_TOKEN_SECRET,
        });

        try {
            const tweetResponse = await client.post('statuses/update', {
                status: tweet,
                ...(previousId ? {in_reply_to_status_id: previousId} : {}),
            });
            console.log(tweetResponse);

            return tweetResponse.id_str;
        } catch (error) {
            console.error(error);
        }
    },
    async mastodon(tweet, image, previousId) {
        const client = new Mastodon({
            access_token: process.env.MASTODON_ACCESS_TOKEN,
            api_url: `https://${process.env.MASTODON_INSTANCE}/api/v1/`
        });

        const mediaIds = [];
        if (image) {
            try {
                const mediaResponse = await client.post('media', {
                    file: image,
                    description: 'Screenshot of the link above'
                });
                console.log(mediaResponse);
                mediaIds.push(mediaResponse.data.id);
            } catch (error) {
                console.error(error);
            }
        }

        try {
            const tweetResponse = await client.post('statuses', {
                status: tweet,
                media_ids: mediaIds,
                visibility: 'unlisted',
                ...(previousId ? {in_reply_to_id: previousId} : {}),
            });
            console.log(tweetResponse.data);
            return tweetResponse.data.id;
        } catch (error) {
            console.error(error);
        }
    },
};

const tmpDir = `${__dirname}/../cache/tmp`;
fs.mkdirSync(tmpDir, {recursive: true});
const imageTmpPath = `${tmpDir}/calendar-tmp.png`;

const lastPostId = {};

const timer = ms => new Promise( res => setTimeout(res, ms));

(async () => {
    if (process.argv.length !== 4) {
        console.error('Missing parameters. Usage: node server/calendarBot.js <locales> <publishers>');
        return;
    }
    for (let locale of process.argv[2].split(',')) {
        console.log('------------');
        console.log(locales[locale].name);

        const { day, message, image } = await (await fetch(locales[locale].url + '/api/calendar/today')).json();
        console.log('<<<', message, '>>>');
        if (!message) { continue; }

        fs.writeFileSync(imageTmpPath, Buffer.from(await (await fetch(image)).arrayBuffer()), {encoding: 'binary'});
        let imageStream = null;
        try {
            imageStream = fs.createReadStream(imageTmpPath);
        } catch {}

        for (let publisher of process.argv[3].split(',')) {
            console.log('Publishing: ' + publisher);
            const postId = await publishers[publisher](
                message,
                imageStream,
                lastPostId[publisher]
            );
            console.log(postId);
            lastPostId[publisher] = postId;
        }
    }
})();
