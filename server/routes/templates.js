import { Router } from 'express';
import { loadTsv } from '../loader';
import {buildTemplate, parseTemplates} from "../../src/buildTemplate";
import {buildList} from "../../src/helpers";
import {Example} from "../../src/classes";

const buildExample = e => new Example(
    Example.parse(e.singular),
    Example.parse(e.plural || e.singular),
    e.isHonorific,
)

const requestExamples = r => {
    if (!r || !r.length) {
        return loadTsv('templates/examples');
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
    const templates = parseTemplates(loadTsv('templates/templates'));
    for (let template in templates) {
        if (!templates.hasOwnProperty(template)) { continue; }
        templates[template].examples = addExamples(templates[template], requestExamples(req.query.examples))
    }
    return res.json(templates);
});

router.get('/pronouns/:pronoun*', async (req, res) => {
    const pronoun = buildTemplate(
        parseTemplates(loadTsv('templates/templates')),
        req.params.pronoun + req.params[0],
    );
    if (pronoun) {
        pronoun.examples = addExamples(pronoun, requestExamples(req.query.examples))
    }
    return res.json(pronoun);
});

export default router;
