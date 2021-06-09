import { Router } from 'express';
import { loadTsv } from '../loader';
import {buildPronoun, parsePronouns} from "../../src/buildPronoun";
import {Example} from "../../src/classes";
import sha1 from 'sha1';
import {handleErrorAsync} from "../../src/helpers";

import awsConfig from '../aws';
import Polly from 'aws-sdk/clients/polly';
import S3 from 'aws-sdk/clients/s3';

const router = Router();

router.get('/pronounce/:voice/:pronoun*', handleErrorAsync(async (req, res) => {
    const pronounString = req.params.pronoun + req.params[0];
    const pronoun = buildPronoun(
        parsePronouns(loadTsv('pronouns/pronouns')),
        pronounString,
    );

    if (!pronoun || !req.query.example) {
        return res.status(404).json({error: 'Not found'});
    }

    let [singular, plural, isHonorific] = req.query.example.split('|');
    const example = new Example(
        Example.parse(singular),
        Example.parse(plural || singular),
        !!parseInt(isHonorific || '0'),
    )

    const text = example.pronounce(pronoun);

    if (!text || text.length > 256) {
        return res.status(404).json({error: 'Not found'});
    }

    const voice = req.config.pronunciation.voices[req.params.voice];
    if (!voice) {
        return res.status(404).json({error: 'Not found'});
    }

    const s3 = new S3(awsConfig);
    const polly = new Polly(awsConfig);

    const key = `pronunciation/${req.config.locale}-${req.params.voice}/${pronounString}/${sha1(text)}.mp3`;

    try {
        const s3getResponse = await s3.getObject({Key: key}).promise();
        return res.set('content-type', s3getResponse.ContentType).send(s3getResponse.Body);
    } catch {
        const pollyResponse = await polly.synthesizeSpeech({
            TextType: 'ssml',
            Text: text,
            OutputFormat: 'mp3',
            LanguageCode: voice.language,
            VoiceId: voice.voice,
            Engine: voice.engine,
        }).promise();

        const s3putResponse = await s3.putObject({
            Key: key,
            Body: pollyResponse.AudioStream,
            ContentType: pollyResponse.ContentType,
        }).promise();

        return res.set('content-type', pollyResponse.ContentType).send(pollyResponse.AudioStream);
    }
}));

export default router;
