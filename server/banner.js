import { buildTemplate, parseTemplates } from "../src/buildTemplate";
import { createCanvas, registerFont, loadImage } from 'canvas';
import { loadTsv } from './tsv';
import translations from '../server/translations';
import {gravatar, renderImage, renderText} from "../src/helpers";
const dbConnection = require('./db');
const SQL = require('sql-template-strings');


const drawCircle = (context, image, x, y, size) => {
    context.save();
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.drawImage(image, x, y, size, size)

    context.beginPath();
    context.arc(x, y, size / 2, 0, Math.PI * 2, true);
    context.clip();
    context.closePath();
    context.restore();
}


export default async function (req, res, next) {
    if (req.url.substr(req.url.length - 4) !== '.png') {
        return renderText(res, 'Not found', 404);
    }

    const templateName = decodeURIComponent(req.url.substr(1, req.url.length - 5));

    const width = 1200
    const height = 600
    const mime = 'image/png';
    const imageSize = 200;
    let leftRatio = 4;

    registerFont('static/fonts/quicksand-v21-latin-ext_latin-regular.ttf', { family: 'Quicksand', weight: 'regular'});
    registerFont('static/fonts/quicksand-v21-latin-ext_latin-700.ttf', { family: 'Quicksand', weight: 'bold'});

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.fillStyle = '#000'

    const fallback = async _ => {
        const logo = await loadImage('node_modules/@fortawesome/fontawesome-pro/svgs/light/tags.svg');
        leftRatio = 5;
        context.drawImage(logo, width / leftRatio - imageSize / 2, height / 2 - imageSize / 1.25 / 2, imageSize, imageSize / 1.25);
        context.font = 'regular 120pt Quicksand';
        context.fillText(translations.title, width / leftRatio + imageSize / 1.5, height / 2 + 48);
    }

    if (templateName.startsWith('@')) {
        const db = await dbConnection();
        const user = await db.get(SQL`SELECT username, email FROM users WHERE username=${templateName.substring(1)}`);
        if (!user) {
            await fallback();
            return renderImage(res, canvas, mime);
        }

        const avatar = await loadImage(gravatar(user, imageSize));

        drawCircle(context, avatar, width / leftRatio - imageSize / 2, height / 2 - imageSize / 2, imageSize);

        context.font = `regular 48pt Quicksand`
        context.fillText('@' + user.username, width / leftRatio + imageSize, height / 2)

        const logo = await loadImage('static/favicon.svg');

        context.font = 'regular 24pt Quicksand'
        context.fillStyle = '#C71585';
        const logoSize = 24 * 1.25;
        context.drawImage(logo, width / leftRatio + imageSize, height / 2 + logoSize - 4, logoSize, logoSize / 1.25)
        context.fillText(translations.title, width / leftRatio + imageSize + 36, height / 2 + 48);

        return renderImage(res, canvas, mime);
    }

    const template = buildTemplate(
        parseTemplates(loadTsv(__dirname + '/../data/templates/templates.tsv')),
        templateName,
    );

    const logo = await loadImage('node_modules/@fortawesome/fontawesome-pro/svgs/light/tags.svg');

    if (!template && templateName !== 'dowolne') {
        await fallback();
        return renderImage(res, canvas, mime);
    }

    context.drawImage(logo, width / leftRatio - imageSize / 2, height / 2 - imageSize / 1.25 / 2, imageSize, imageSize / 1.25)
    context.font = 'regular 48pt Quicksand'
    context.fillText(translations.template.intro + ':', width / leftRatio + imageSize / 1.5, height / 2 - 36)

    const templateNameOptions = templateName === 'dowolne' ? ['dowolne'] : template.nameOptions();
    context.font = `bold ${templateNameOptions.length <= 2 ? '70' : '36'}pt Quicksand`
    context.fillText(templateNameOptions.join('\n'), width / leftRatio + imageSize / 1.5, height / 2 + (templateNameOptions.length <= 2 ? 72 : 24))

    return renderImage(res, canvas, mime);
}
