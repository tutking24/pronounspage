import {Source, Example, NounTemplate, TemplateGroup, TemplateLibrary, Name, Person, NounDeclension} from './classes'
import { buildDict, buildList } from './helpers';
import { parseTemplates, getTemplate } from './buildTemplate';
import sourcesForMultipleForms from '../data/sources/sourcesMultiple';

export const locales = {
    en: { name: 'English', url: 'https://en.pronouns.page' },
    pl: { name: 'Polski', url: 'https://zaimki.pl' },
    de: { name: 'Deutsch', url: 'https://de.pronouns.page' },
    nl: { name: 'Nederlands', url: 'https://nl.pronouns.page' },
}

import templatesRaw from '../data/templates/templates.tsv';
export const templates = parseTemplates(templatesRaw);

import examplesRaw from '../data/templates/examples.tsv';
export const examples = buildList(function* () {
    for (let e of examplesRaw) {
        yield new Example(
            Example.parse(e.singular),
            Example.parse(e.plural || e.singular),
            e.isHonorific,
        );
    }
});

import sourcesRaw from '../data/sources/sources.tsv';
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

import nounTemplatesRaw from '../data/nouns/nounTemplates.tsv';
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

import templateGroupsRaw from '../data/templates/templateGroups.tsv';
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

import namesRaw from '../data/names/names.tsv';
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

import peopleRaw from '../data/people/people.tsv';
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

import nounDeclensionTemplatesRaw from '../data/nouns/nounDeclension.tsv';
export const nounDeclensionTemplates = buildList(function* () {
    for (let d of nounDeclensionTemplatesRaw) {
        yield new NounDeclension(d);
    }
});
