import { Router } from 'express';
import SQL from 'sql-template-strings';
import {createCanvas, loadImage, registerFont} from "canvas";
import { loadSuml } from '../loader';
import avatar from '../avatar';
import {buildPronoun, parsePronouns} from "../../src/buildPronoun";
import {loadTsv} from "../../src/tsv";
import {handleErrorAsync} from "../../src/helpers";
import { CacheObject } from "../../src/cache";
import {registerLocaleFont} from "../localeFont";

const translations = loadSuml('translations');

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

router.get('/banner/:pronounName*.png', handleErrorAsync(async (req, res) => {
    const width = 1200
    const height = 600
    const mime = 'image/png';
    const imageSize = 200;
    let leftRatio = 4;

    const pronounName = req.params.pronounName + req.params[0];

    const result = await new CacheObject('banner', `${pronounName}.png`, 24 * 60).fetch(async () => {
        const fontName = registerLocaleFont('fontHeadings', ['regular', 'bold']);

        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')

        const bg = await loadImage('static/bg.png');
        context.drawImage(bg, 0, 0, width, height);

        const logo = await loadImage('static/logo/logo.svg');
        const logoPrimary = await loadImage('static/logo/logo-primary.svg');

        const fallback = async _ => {
            leftRatio = 5;
            context.drawImage(logo, width / leftRatio - imageSize / 2, height / 2 - imageSize / 2, imageSize, imageSize);
            context.font = `regular ${translations.title.length < 10 ? 120 : translations.title.length < 14 ? 80 : 72}pt '${fontName}'`;
            context.fillText(translations.title, width / leftRatio + imageSize / 1.5, height / 2 + (translations.title.length < 10 ? 48 : translations.title.length < 14 ? 36 : 24));
        }

        if (pronounName.startsWith('@')) {
            const user = await req.db.get(SQL`SELECT id, username, email, avatarSource FROM users WHERE username=${pronounName.substring(1)}`);
            if (!user) {
                await fallback();
                return canvas.toBuffer(mime);
            }

            const avatarImage = await loadImage(await avatar(req.db, user));

            drawCircle(context, avatarImage, width / leftRatio - imageSize / 2, height / 2 - imageSize / 2, imageSize);

            context.font = `regular 48pt '${fontName}'`
            context.fillText('@' + user.username, width / leftRatio + imageSize, height / 2)

            context.font = `regular 24pt '${fontName}'`
            context.fillStyle = '#C71585';
            const logoSize = 24 * 1.25;
            context.drawImage(logoPrimary, width / leftRatio + imageSize, height / 2 + logoSize - 8, logoSize, logoSize)
            context.fillText(translations.title, width / leftRatio + imageSize + 36, height / 2 + 48);

            return canvas.toBuffer(mime);
        }

        const pronoun = buildPronoun(
            parsePronouns(loadTsv(__dirname + '/../../data/pronouns/pronouns.tsv')),
            pronounName,
        );

        if (pronounName === 'zaimki' || (!pronoun && pronounName !== global.config.pronouns.any && (!global.config.pronouns || pronounName !== global.config.pronouns.mirror))) {
            await fallback();
            return canvas.toBuffer(mime);
        }

        context.drawImage(logo, width / leftRatio - imageSize / 2, height / 2 - imageSize / 2, imageSize, imageSize)
        context.font = `regular 48pt '${fontName}'`;
        context.fillText(translations.pronouns.intro + ':', width / leftRatio + imageSize / 1.5, height / 2 - 36)

        const pronounNameOptions = pronounName === global.config.pronouns.any ? [global.config.pronouns.any] : pronoun.nameOptions();
        context.font = `bold ${pronounNameOptions.length <= 2 ? '70' : '36'}pt '${fontName}'`;
        context.fillText(
            pronounNameOptions.map(o => o.replace(/ ?\[[^\]]+] ?/g, '').trim()).join('\n'),
            width / leftRatio + imageSize / 1.5,
            height / 2 + (pronounNameOptions.length <= 2 ? 72 : 24)
        );

        return canvas.toBuffer(mime);
    });

    return res.set('content-type', mime).send(result);
}));

export default router;
