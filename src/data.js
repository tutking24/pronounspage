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

export const nounTemplates = [
    new NounTemplate(['log'], ['lożka'], ['logum'], ['logowie'], ['lożki'], ['loga', 'loża']),
    new NounTemplate([''], ['ka'], ['um'], ['owie'], ['ki'], ['a']),
    new NounTemplate(['ca'], ['czyni'], ['cum'], ['cy'], ['czynie'], ['ca']),
    new NounTemplate(['k'], ['czka'], ['kum', 'czę'], ['cy'], ['czki'], ['ka', 'cza']),
    new NounTemplate(['t'], ['tka'], ['tum'], ['ci'], ['tki'], ['ta']),
    new NounTemplate(['sta'], ['stka'], ['stum', 'szczę'], ['ści'], ['stki'], ['sta', 'szcza']),
    new NounTemplate(['n'], ['nka'], ['nię', 'num'], ['ni'], ['nki'], ['na', 'ństwo', 'nięta']),
    new NounTemplate(['wy'], ['wa'], ['we'], ['wi'], ['we'], ['we']),
    new NounTemplate(['ny'], ['na'], ['ne'], ['ni'], ['ne'], ['ne']),
    new NounTemplate(['rz'], ['rka'], ['rzę', 'rzum'], ['rze'], ['rki'], ['rzęta', 'rza']),
    new NounTemplate(['er'], ['ra'], ['rum'], ['rowie'], ['ry'], ['ra']),
];

