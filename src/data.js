import { Source, Example, NounTemplate, TemplateGroup, TemplateLibrary, Name, Person } from './classes'
import { buildDict, buildList } from './helpers';
import { parseTemplates, getTemplate } from './buildTemplate';

export const locales = {
    en: { name: 'English', url: 'https://en.pronouns.page' },
    pl: { name: 'Polski', url: 'https://zaimki.pl' },
    de: { name: 'Deutsch', url: 'https://de.pronouns.page' },
    nl: { name: 'Nederlands', url: 'https://nl.pronouns.page' },
}

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

// TODO move to locale
export const sourcesForMultipleForms = {
    'on&ona': ['genderneutralizacja', 'niebTlum', 'jurewicz', 'krem', 'krolowaZimy', 'mlotThora', 'statekUmarlych', 'starWarsKoPo', 'luBart1'],
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
            if (multiple === selectedTemplate.canonicalName) {
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

import templateGroupsRaw from '../data/templateGroups.tsv';
export const templateGroups = buildList(function* () {
    for (let g of templateGroupsRaw) {
        yield new TemplateGroup(
            g.name,
            g.templates.split(','),
            g.description,
        );
    }
});

export const templateLibrary = new TemplateLibrary(templateGroups, templates);

import namesRaw from '../data/names.tsv';
export const names = buildDict(function* () {
    for (let n of namesRaw) {
        yield [n.name, new Name(
            n.name,
            n.origin,
            n.meaning,
            n.usage,
            n.legally,
            n.pros ? n.pros.split(',') : [],
            n.cons ? n.cons.split(',') : [],
            n.notablePeople ? n.notablePeople.split(',') : [],
            n.count,
            n.links ? n.links.split(' ') : [],
        )];
    }
});

import peopleRaw from '../data/people.tsv';
export const people = buildList(function* () {
    for (let p of peopleRaw) {
        yield new Person(
            p.name,
            p.description,
            p.pronouns.split(','),
            p.sources ? p.sources.split(',') : [],
        );
    }
});
