const fetch = require('node-fetch');
const S3 = require("aws-sdk/clients/s3");
const awsConfig = require("./aws");
const md5 = require('js-md5');
const {loadImage, createCanvas} = require('canvas');
const s3 = new S3(awsConfig);

module.exports = async (provider, url) => {
    if (!url) { return null; }

    const key = `images-copy/${provider}/${md5(url)}.png`

    try {
        await s3.headObject({Key: key}).promise();

        return `${process.env.CLOUDFRONT}/${key}`;
    } catch {
        try {
            const image = await loadImage(Buffer.from(await (await fetch(url)).arrayBuffer()));
            let canvas = createCanvas(image.width, image.height);
            canvas.getContext('2d').drawImage(image, 0, 0);

            await s3.putObject({
                Key: key,
                Body: canvas.toBuffer('image/png'),
                ContentType: 'image/png',
                ACL: 'public-read',
            }).promise();

            return `${process.env.CLOUDFRONT}/${key}`;
        } catch (e) { return null; }
    }
}
