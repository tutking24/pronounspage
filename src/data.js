import {Source, Example, NounTemplate} from './classes'
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
    'on&ona': ['genderneutralizacja', 'niebTlum', 'jurewicz', 'krolowaZimy', 'mlotThora', 'statekUmarlych', 'starWarsKoPo'],
    'ona&onu': ['liniaOporuMix'],
    'ono/jego&ono/jej': ['kazmierczak'],
}

export const getSources = (selectedTemplate) => {
    if (!selectedTemplate) {
        return {};
    }

    let sources = {};
    for (let multiple in sourcesForMultipleForms) {
        if (sourcesForMultipleForms.hasOwnProperty(multiple)) {
            if (multiple === selectedTemplate.morphemes.pronoun_n) {
                sources[multiple] = sourcesForMultipleForms[multiple];
            }
        }
    }
    for (let option of selectedTemplate.nameOptions()) {
        const template = getTemplate(templates, option);
        if (template && template.sources.length) {
            sources[option] = template.sources;
        }
    }
    return sources;
}

import nounTemplatesRaw from '../data/nounTemplates.tsv';
export const nounTemplates = buildList(function* () {
    for (let t of nounTemplatesRaw) {
        yield new NounTemplate(
            t.masc.replace(/-/g, '').split('/'),
            t.fem.replace(/-/g, '').split('/'),
            t.neutr.replace(/-/g, '').split('/'),
            t.mascPl.replace(/-/g, '').split('/'),
            t.femPl.replace(/-/g, '').split('/'),
            t.neutrPl.replace(/-/g, '').split('/'),
        );
    }
});

export const separators = ['ono/jego', 'onu/jenu', 'oni/ich', 'onæ/jæ', 'vono/vego', 'on&ona'];
