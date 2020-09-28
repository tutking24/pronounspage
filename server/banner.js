import { buildTemplate, parseTemplates } from "../src/buildTemplate";
import { createCanvas, registerFont, loadImage } from 'canvas';
import Papa from 'papaparse';
import fs from 'fs';
import translations from '../server/translations';

const loadTsv = (filename) => {
    return Papa.parse(fs.readFileSync(__dirname + '/../data/' + filename).toString('utf-8'), {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
    }).data;
};

export default async function (req, res, next) {
    if (req.url.substr(req.url.length - 4) !== '.png') {
        res.statusCode = 404;
        res.write('Not found');
        res.end();
        return;
    }

    const templateName = decodeURIComponent(req.url.substr(1, req.url.length - 5));

    const template = buildTemplate(
        parseTemplates(loadTsv('templates.tsv')),
        templateName,
    );

    const width = 1200
    const height = 600
    const mime = 'image/png';
    const imageSize = 200;
    const leftRatio = template || templateName === 'dowolne' ? 4 : 5;

    registerFont('static/fonts/quicksand-v21-latin-ext_latin-regular.ttf', { family: 'Quicksand', weight: 'regular'});
    registerFont('static/fonts/quicksand-v21-latin-ext_latin-700.ttf', { family: 'Quicksand', weight: 'bold'});

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.fillStyle = '#000'

    const image = await loadImage('node_modules/@fortawesome/fontawesome-pro/svgs/light/tags.svg');
    context.drawImage(image, width / leftRatio - imageSize / 2, height / 2 - imageSize / 1.25 / 2, imageSize, imageSize / 1.25)

    if (template || templateName === 'dowolne') {
        context.font = 'regular 48pt Quicksand'
        context.fillText(translations.template.intro + ':', width / leftRatio + imageSize / 1.5, height / 2 - 36)

        const templateNameOptions = templateName === 'dowolne' ? ['dowolne'] : template.nameOptions();
        context.font = `bold ${templateNameOptions.length <= 2 ? '70' : '36'}pt Quicksand`
        context.fillText(templateNameOptions.join('\n'), width / leftRatio + imageSize / 1.5, height / 2 + (templateNameOptions.length <= 2 ? 72 : 24))
    } else {
        context.font = 'regular 120pt Quicksand'
        context.fillText(translations.title, width / leftRatio + imageSize / 1.5, height / 2 + 48)
    }

    res.setHeader('content-type', mime);
    res.write(canvas.toBuffer(mime));
    res.end()
}
