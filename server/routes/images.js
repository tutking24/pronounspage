import { Router } from 'express';
import {ulid} from "ulid";
import multer from 'multer';
import {loadImage, createCanvas} from 'canvas';
import {handleErrorAsync} from "../../src/helpers";
import sharp from 'sharp';
import fs from 'fs';
import SQL from 'sql-template-strings';
import path from 'path';

import awsConfig from '../aws';
import S3 from 'aws-sdk/clients/s3';

const sizes = {
    big: [1200, false],
    flag: [256, false],
    thumb: [192, true],
    avatar: [144, true],
}

const resizeImage = (image, width, height, sx = null, sy = null) => {
    const canvas = createCanvas(width, height);
    if (sx === null) {
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    } else {
        canvas.getContext('2d').drawImage(image, sx, sy, width, height, 0, 0, width, height);
    }

    return canvas;
}

const cropToSquare = (image) => {
    return image.width > image.height
        ? resizeImage(image, image.height, image.height, (image.width - image.height) / 2, 0)
        : resizeImage(image, image.width, image.width, 0, (image.height - image.width) / 2);
}

const scaleDownTo = (image, size) => {
    if (image.width > image.height) {
        return image.width > size
            ? resizeImage(image, size, image.height * size / image.width)
            : image;
    }

    return image.height > size
        ? resizeImage(image, image.width * size / image.height, size)
        : image;
}

const router = Router();

router.post('/images/upload', multer({limits: {fileSize: 10 * 1024 * 1024}}).any('images[]', 12), handleErrorAsync(async (req, res) => {
    const s3 = new S3(awsConfig);

    const requestedSizes = req.query.sizes === undefined || req.query.sizes === 'all'
        ? null
        : req.query.sizes.split(',');

    const ids = [];
    for (let file of req.files) {
        const id = ulid();
        const image = await loadImage(await sharp(file.buffer).png().toBuffer());

        for (let s in sizes) {
            if (!sizes.hasOwnProperty(s)) { continue; }
            if (requestedSizes !== null && !requestedSizes.includes(s)) { continue; }

            const [size, square] = sizes[s];

            let canvas = createCanvas(image.width, image.height);
            canvas.getContext('2d').drawImage(image, 0, 0);

            if (square) {
                canvas = cropToSquare(canvas);
            }

            canvas = scaleDownTo(canvas, size);

            await s3.putObject({
                Key: `images/${id}-${s}.png`,
                Body: canvas.toBuffer('image/png'),
                ContentType: 'image/png',
                ACL: 'public-read',
            }).promise();
        }

        ids.push(id);
    }
    return res.json(ids);
}));

router.get('/download/:filename*', handleErrorAsync(async (req, res) => {
    const filename = req.params.filename + req.params[0];

    const filepath = `${__dirname}/../../locale/${global.config.locale}/files/${filename}`;

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({error: 'Not found'});
    }

    await req.db.get(SQL`INSERT INTO downloads (id, locale, filename) VALUES (${ulid()}, ${global.config.locale}, ${filename});`);

    return res.download(path.resolve(filepath));
}));

router.get('/downloads', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const stats = {};

    for (let {filename, c} of await req.db.all(SQL`SELECT filename, count(*) as c FROM downloads WHERE locale = ${global.config.locale} GROUP BY filename;`)) {
        stats[filename] = c;
    }

    return res.json(stats);
}));

export default router;
