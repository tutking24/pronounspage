import { Router } from 'express';
import { loadTsv } from '../loader';
import {buildPronoun, parsePronouns} from "../../src/buildPronoun";
import {buildList} from "../../src/helpers";
import {Example} from "../../src/classes";

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

router.get('/pronouns', async (req, res) => {
    const pronouns = parsePronouns(loadTsv('pronouns/pronouns'));
    for (let pronoun in pronouns) {
        if (!pronouns.hasOwnProperty(pronoun)) { continue; }
        pronouns[pronoun].examples = addExamples(pronouns[pronoun], requestExamples(req.query.examples))
    }
    return res.json(pronouns);
});

router.get('/pronouns/:pronoun*', async (req, res) => {
    const pronoun = buildPronoun(
        parsePronouns(loadTsv('pronouns/pronouns')),
        req.params.pronoun + req.params[0],
    );
    if (pronoun) {
        pronoun.examples = addExamples(pronoun, requestExamples(req.query.examples))
    }
    return res.json(pronoun);
});

export default router;
