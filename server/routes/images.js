import { Router } from 'express';
import {ulid} from "ulid";
import multer from 'multer';
import {loadImage, createCanvas} from 'canvas';

import awsConfig from '../aws';
import S3 from 'aws-sdk/clients/s3';

const sizes = {
    big: [1600, false],
    thumb: [240, true],
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

router.post('/images/upload', multer({limits: {fileSize: 5 * 1024 * 1024}}).any('images[]', 12), async (req, res) => {
    const s3 = new S3(awsConfig);

    const ids = [];
    for (let file of req.files) {
        const id = ulid();
        const image = await loadImage(file.buffer);

        for (let s in sizes) {
            if (!sizes.hasOwnProperty(s)) { continue; }
            const [size, square] = sizes[s];

            let canvas = createCanvas(image.width, image.height);
            canvas.getContext('2d').drawImage(image, 0, 0);

            if (square) {
                console.log('crop to square');
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
});

export default router;
