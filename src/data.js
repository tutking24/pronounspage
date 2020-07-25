import { Source, Example, Template, MORPHEMES } from './classes'
import { buildDict, buildList } from './helpers';

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

import templatesRaw from '../data/templates.tsv';
export const templates = buildDict(function* () {
    for (let t of templatesRaw) {
        const aliases = t.key.split(',')

        yield [
            aliases[0],
            new Template(
                t.description,
                buildDict(function* () {
                    for (let morpheme of MORPHEMES) {
                        yield [morpheme, t[morpheme]];
                    }
                }),
                t.plural,
                t.pluralHonorific,
                t.sources ? t.sources.split(',') : [],
                aliases.slice(1),
                t.history,
            )
        ];
    }
})
