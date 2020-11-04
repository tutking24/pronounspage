import { Router } from 'express';
import SQL from 'sql-template-strings';
import {createCanvas, loadImage, registerFont} from "canvas";
import translations from "../translations";
import avatar from '../avatar';
import {buildTemplate, parseTemplates} from "../../src/buildTemplate";
import {loadTsv} from "../../src/tsv";

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

const router = Router();

router.get('/banner/:templateName*.png', async (req, res) => {
    const templateName = req.params.templateName + req.params[0];
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
        const user = await req.db.get(SQL`SELECT id, username, email, avatarSource FROM users WHERE username=${templateName.substring(1)}`);
        if (!user) {
            await fallback();
            return res.set('content-type', mime).send(canvas.toBuffer(mime));
        }

        const avatarImage = await loadImage(await avatar(req.db, user));

        drawCircle(context, avatarImage, width / leftRatio - imageSize / 2, height / 2 - imageSize / 2, imageSize);

        context.font = `regular 48pt Quicksand`
        context.fillText('@' + user.username, width / leftRatio + imageSize, height / 2)

        const logo = await loadImage('static/favicon.svg');

        context.font = 'regular 24pt Quicksand'
        context.fillStyle = '#C71585';
        const logoSize = 24 * 1.25;
        context.drawImage(logo, width / leftRatio + imageSize, height / 2 + logoSize - 4, logoSize, logoSize / 1.25)
        context.fillText(translations.title, width / leftRatio + imageSize + 36, height / 2 + 48);

        return res.set('content-type', mime).send(canvas.toBuffer(mime));
    }

    const template = buildTemplate(
        parseTemplates(loadTsv(__dirname + '/../../data/templates/templates.tsv')),
        templateName,
    );

    const logo = await loadImage('node_modules/@fortawesome/fontawesome-pro/svgs/light/tags.svg');

    if (!template && templateName !== 'dowolne') { // TODO
        await fallback();
        return res.set('content-type', mime).send(canvas.toBuffer(mime));
    }

    context.drawImage(logo, width / leftRatio - imageSize / 2, height / 2 - imageSize / 1.25 / 2, imageSize, imageSize / 1.25)
    context.font = 'regular 48pt Quicksand'
    context.fillText(translations.template.intro + ':', width / leftRatio + imageSize / 1.5, height / 2 - 36)

    const templateNameOptions = templateName === 'dowolne' ? ['dowolne'] : template.nameOptions();
    context.font = `bold ${templateNameOptions.length <= 2 ? '70' : '36'}pt Quicksand`
    context.fillText(templateNameOptions.join('\n'), width / leftRatio + imageSize / 1.5, height / 2 + (templateNameOptions.length <= 2 ? 72 : 24))

    return res.set('content-type', mime).send(canvas.toBuffer(mime));
});

export default router;
