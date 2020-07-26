import { Source, Example } from './classes'
import { buildDict, buildList } from './helpers';
import { parseTemplates, getTemplate } from './buildTemplate';

import templatesRaw from '../data/templates.tsv';
export const templates = parseTemplates(templatesRaw);

import examplesRaw from '../data/examples.tsv';
export const examples = buildList(function* () {
    for (let e of examplesRaw) {
        yield new Example(
            Example.parse(e.singular),
            Example.parse(e.plural || e.singular),
            e.isHonorific,
        );
    }
});

import sourcesRaw from '../data/sources.tsv';
export const sources = buildDict(function* () {
    for (let s of sourcesRaw) {
        yield [
            s.key,
            new Source(
                s.type,
                s.author,
                s.title,
                s.extra,
                s.year,
                s.fragments ? s.fragments.replace(/\|/g, '\n').split('@') : [],
                s.comment,
                s.link,
            )
        ];
    }
});

export const sourcesForMultipleForms = {
    'on&ona': ['jurewicz'],
}

export const getSources = (selectedTemplate) => {
    if (!selectedTemplate) {
        return [];
    }

    let sources = [];
    for (let option of selectedTemplate.nameOptions()) {
        const template = getTemplate(templates, option);
        if (template && template.sources.length) {
            sources = [...sources, ...template.sources];
        }
    }
    return sources;
}
