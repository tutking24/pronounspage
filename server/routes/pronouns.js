import { Router } from 'express';
import { loadTsv } from '../loader';
import {buildPronoun, parsePronouns} from "../../src/buildPronoun";
import {buildList, handleErrorAsync} from "../../src/helpers";
import {Example} from "../../src/classes";
import {caches} from '../../src/cache';
import md5 from "js-md5";
import assert from 'assert';
import fetch from "node-fetch";

const buildExample = e => new Example(
    Example.parse(e.singular),
    Example.parse(e.plural || e.singular),
    e.isHonorific,
)

const requestExamples = r => {
    if (!r || !r.length) {
        return loadTsv('pronouns/examples');
    }

    return buildList(function* () {
        for (let rr of r) {
            let [singular, plural, isHonorific] = rr.split('|');
            yield { singular, plural, isHonorific: !!isHonorific};
        }
    });
}

const addExamples = (pronoun, examples) => {
    return buildList(function* () {
        for (let example of examples) {
            yield buildExample(example).format(pronoun);
        }
    });
}

const router = Router();

router.get('/pronouns', handleErrorAsync(async (req, res) => {
    const pronouns = parsePronouns(loadTsv('pronouns/pronouns'));
    for (let pronoun in pronouns) {
        if (!pronouns.hasOwnProperty(pronoun)) { continue; }
        pronouns[pronoun].examples = addExamples(pronouns[pronoun], requestExamples(req.query.examples))
    }
    return res.json(pronouns);
}));

router.get('/pronouns/:pronoun*', handleErrorAsync(async (req, res) => {
    const pronoun = buildPronoun(
        parsePronouns(loadTsv('pronouns/pronouns')),
        req.params.pronoun + req.params[0],
    );
    if (pronoun) {
        pronoun.examples = addExamples(pronoun, requestExamples(req.query.examples))
        pronoun.name = pronoun.name();
    }
    return res.json(pronoun);
}));

router.get('/pronouns-name/:pronoun*', handleErrorAsync(async (req, res) => {
    const pronoun = buildPronoun(
        parsePronouns(loadTsv('pronouns/pronouns')),
        req.params.pronoun + req.params[0],
    );
    if (!pronoun) {
        return res.status(404).json({error: 'Not found'});
    }
    return res.json(pronoun.name());
}));

router.get('/remote-pronouns-name/:locale/:pronoun*', handleErrorAsync(async (req, res) => {
    assert(req.locales.hasOwnProperty(req.params.locale));
    const pronoun = req.params.pronoun + req.params[0];
    const name = await caches.pronounNames(`${req.params.locale}/${md5(pronoun)}.txt`).fetch(async () => {
        const res = await (await fetch(`${req.locales[req.params.locale].url}/api/pronouns-name/${pronoun.split('/').map(p => encodeURIComponent(p))}`)).json();
        if (typeof(res) === 'object' && res.error) { return pronoun; }
        return res;
    });

    return res.json(name);
}));

export default router;
