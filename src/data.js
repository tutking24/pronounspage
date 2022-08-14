import {Source, Example, NounTemplate, PronounGroup, PronounLibrary, Name, Person, NounDeclension} from './classes'
import { buildDict, buildList } from './helpers';
import { parsePronouns } from './buildPronoun';

// TODO(96): Make this provided by router
import { pronounsRaw, examplesRaw, nounTemplatesRaw, pronounGroupsRaw, peopleRaw, nounDeclensionTemplatesRaw, abbreviationsRaw } from './localeData';
export const pronouns = parsePronouns(pronounsRaw);

export const examples = buildList(function* () {
    for (let e of examplesRaw) {
        yield new Example(
            Example.parse(e.singular),
            Example.parse(e.plural || e.singular),
            e.isHonorific,
        );
    }
});

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

export const pronounGroups = buildList(function* () {
    for (let g of pronounGroupsRaw) {
        yield new PronounGroup(
            g.name,
            g.pronouns ? g.pronouns.split(',') : [],
            g.description,
            g.key || null,
        );
    }
});

export const pronounLibrary = new PronounLibrary(pronounGroups, pronouns);

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

export const nounDeclensionTemplates = buildList(function* () {
    for (let d of nounDeclensionTemplatesRaw) {
        yield new NounDeclension(d);
    }
});

export const abbreviations = buildDict(function* () {
    for (let a of abbreviationsRaw) {
        yield [a.abbreviation, a.meaning];
    }
});
