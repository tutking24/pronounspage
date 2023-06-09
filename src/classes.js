import {buildDict, buildList, capitalise} from "./helpers";
import MORPHEMES from '../data/pronouns/morphemes';

const config = process.env.CONFIG || global.config;

export class ExamplePart {
    constructor(variable, str) {
        this.variable = variable;
        this.str = str;
    }
}

export class Example {
    constructor(singularParts, pluralParts, isHonorific = false) {
        this.singularParts = singularParts;
        this.pluralParts = pluralParts;
        this.isHonorific = isHonorific;
    }

    static parse(str) {
        const parts = [];
        let lastPosition = 0;

        for (let m of str.matchAll(/{('?[a-z0-9_]+)}/g)) {
            const textBefore = str.substr(lastPosition, m.index - lastPosition);
            if (textBefore.length) {
                parts.push(new ExamplePart(false, textBefore));
            }
            parts.push(new ExamplePart(true, m[0].substr(1, m[0].length - 2)));
            lastPosition = m.index + m[0].length;
        }

        const textAfter = str.substr(lastPosition);
        if (textAfter.length) {
            parts.push(new ExamplePart(false, textAfter));
        }

        return parts;
    }

    format(pronoun) {
        const plural = this.isHonorific ? pronoun.pluralHonorific[0] : pronoun.plural[0];

        return capitalise(this[plural ? 'pluralParts' : 'singularParts'].map(part => {
            return part.variable ? pronoun.getMorpheme(part.str) : part.str;
        }).join(''));
    }

    pronounce(pronoun) {
        const plural = this.isHonorific ? pronoun.pluralHonorific[0] : pronoun.plural[0];

        let interchangable = false;

        const buildPronunciation = m => {
            if (pronoun.isInterchangable(m)) {
                interchangable = true;
            }
            const pronunciation = pronoun.getPronunciation(m);
            const morpheme = pronoun.getMorpheme(m);

            return pronunciation
                ? (pronunciation.startsWith('=')
                    ? pronunciation.substring(1)
                    : `<phoneme alphabet="ipa" ph="${pronunciation}">${morpheme}</phoneme>`
                )
                : ( config.pronunciation.ipa && morpheme
                    ? morpheme.split('').map(
                        c => [' ', ',', '.', ':', ';', '–', '-'].includes(c)
                            ? c
                            : `<phoneme alphabet="ipa" ph="${c}">${c}</phoneme>`
                        ).join('')
                    : morpheme
                );
        }

        const ssml = '<speak>' + this[plural ? 'pluralParts' : 'singularParts'].map(part => {
            return part.variable
                ? buildPronunciation(part.str)
                : part.str;
        }).join('') + '</speak>';

        if (interchangable) {
            return null;
        }

        return ssml;
    }

    toString() {
        return this.singularParts.map(part => part.variable ? '{' + part.str + '}' : part.str).join('')
            + '|'
            + this.pluralParts.map(part => part.variable ? '{' + part.str + '}' : part.str).join('')
            + '|'
            + (this.isHonorific ? '1' : '0');
    }
}

function clone(mainObject) {
    let objectCopy = {};
    for (let key in mainObject) {
        if (mainObject.hasOwnProperty(key)) {
            objectCopy[key] = mainObject[key];
        }
    }
    return objectCopy;
}

export class Source {
    constructor ({
             id, pronouns, type, author, title, extra, year, fragments = '',
             comment = null, link = null, spoiler = false,
             submitter = null, approved, base_id = null,
             key = null, versions = [], locale = config.locale,
             images = null,
    }) {
        this.id = id;
        this.pronouns = pronouns ? pronouns.split(';') : [];
        this.type = type;
        this.author = author;
        this.title = title;
        this.extra = extra;
        this.year = year;
        this.fragments = fragments
            ? fragments.replace(/\|/g, '\n').replace(/\\@/g, '###').split('@').map(x => x.replace(/###/g, '@'))
            : [];
        this.comment = comment;
        this.link = link;
        this.spoiler = !!spoiler;
        this.submitter = submitter;
        this.approved = approved;
        this.base_id = base_id;
        this.key = key;
        this.versions = versions.map(v => new Source(v));
        this.locale = locale;
        this.images = images ? images.split(',') : [];
    }

    static get TYPES() {
        return {
            '': 'clipboard-list',
            Book: 'book-open',
            Article: 'newspaper',
            Movie: 'film',
            Series: 'tv',
            Song: 'music',
            Poetry: 'scroll',
            Comics: 'file-image',
            Game: 'gamepad-alt',
            Other: 'comment-alt-lines',
        }
    }

    static get TYPES_PRIORITIES() {
        return {
            Book: 1,
            Article: 2,
            Movie: 3,
            Series: 3,
            Song: 0,
            Poetry: 0,
            Other: 4,
        }
    }

    icon() {
        return Source.TYPES[this.type];
    }
}


export class SourceLibrary {
    constructor(rawSources) {
        this.sources = rawSources.map(s => new Source(s));
        this.map = {};
        const multiple = new Set();
        const pronouns = new Set();
        this.countApproved = 0;
        this.countPending = 0;

        for (let source of this.sources) {
            this[source.approved ? 'countApproved' : 'countPending']++;

            if (!source.pronouns.length) {
                if (this.map[''] === undefined) { this.map[''] = []; }
                this.map[''].push(source);
                continue;
            }
            for (let pronoun of source.pronouns) {
                if (this.map[pronoun] === undefined) { this.map[pronoun] = []; }
                this.map[pronoun].push(source);

                pronouns.add(pronoun);
                if (pronoun.includes('&')) {
                    multiple.add(pronoun);
                }
            }
        }
        this.pronouns = [...pronouns];
        this.multiple = [...multiple];
        this.cache = {}
    }

    getForPronoun(pronoun, pronounLibrary = null) {
        if (this.cache[pronoun] === undefined) {
            let sources = this.map[pronoun] || [];

            if (pronoun === '') {
                for (let p of this.pronouns) {
                    if (pronounLibrary && !pronounLibrary.isCanonical(p)) {
                        sources = [...sources, ...this.map[p]];
                    }
                }
            }

            this.cache[pronoun] = sources
                .map(s => this.addMetaData(s))
                .sort((a, b) => {
                    if (a.typePriority !== b.typePriority) {
                        return b.typePriority - a.typePriority;
                    }

                    return a.sortString.localeCompare(b.sortString);
                });
        }

        return this.cache[pronoun];
    }

    getForPronounExtended(pronoun) {
        let sources = {};
        const s = this.getForPronoun(pronoun);
        sources[pronoun] = s.length ? s : undefined;

        if (pronoun.includes('&')) {
            for (let option of pronoun.split('&')) {
                const s = this.getForPronoun(option);
                sources[option] = s.length ? s : undefined;
            }
        }

        return sources;
    }

    addMetaData(source) {
        source.typePriority = Source.TYPES_PRIORITIES[source.type];

        source.sortString = source.author || 'ZZZZZ' + source.title; // if no author, put on the end
        if (source.sortString.includes('^')) {
            const index = source.sortString.indexOf('^');
            source.sortString = source.sortString.substring(index + 1) + ' ' + source.sortString.substring(0, index);
        }

        source.index = [
            (source.author || '').replace('^', ''),
            source.title,
            source.extra,
            source.year,
            ...source.fragments,
            source.comment,
            source.link,
            source.approved ? '' : '__awaiting__',
        ].join(' ').toLowerCase().replace(/<\/?[^>]+(>|$)/g, '');

        return source;
    }
}


const escape = s => {
    if (Array.isArray(s)) {
        s = s.join('&');
    }
    return (s || '')
        .replace(/,/g, '')
        .replace(/!/g, '')
        .replace(/\./g, '')
        //.replace(/\/', '%2F')
        .replace(/#/g, '%23')
        .replace(/\?/g, '%3F');
}

export class Pronoun {
    constructor (canonicalName, description, normative, morphemes, plural, pluralHonorific, aliases = [], history = '', pronounceable = true, thirdForm = null, smallForm = null, sourcesInfo = null) {
        this.canonicalName = canonicalName;
        this.description = description || '';
        this.normative = normative;
        this.morphemes = {}
        this.pronunciations = {}
        for (let m in morphemes) {
            if (!morphemes.hasOwnProperty(m)) { continue; }
            const [morpheme, pronunciation] = morphemes[m] ? morphemes[m].split('|') : [null, null];
            this.morphemes[m] = morpheme;
            this.pronunciations[m] = pronunciation;
        }
        this.plural = plural;
        this.pluralHonorific = pluralHonorific;
        this.aliases = aliases;
        this.history = history;
        this.pronounceable = pronounceable;
        this.thirdForm = thirdForm;
        this.smallForm = smallForm;
        this.sourcesInfo = sourcesInfo;
    }

    pronoun() {
        return this.morphemes[MORPHEMES[0]];
    }

    nameOptions() {
        const options = new Set();
        const optionsN = (this.morphemes[MORPHEMES[0]] || '').split('&');
        if (MORPHEMES.length === 1) {
            return optionsN;
        }
        const optionsG = (this.morphemes[MORPHEMES[1]] || '').split('&');
        const optionsGAlt = MORPHEMES.length > 2 ? (this.morphemes[MORPHEMES[2]] || '').split('&') : [];

        for (let i in optionsN) {
            let optionN = optionsN[i];
            let optionG = optionsG[i < optionsG.length - 1 ? i : optionsG.length - 1];
            if (optionN === optionG && optionsGAlt.length && !config.pronouns.threeForms) {
                optionG = optionsGAlt[i < optionsGAlt.length - 1 ? i : optionsGAlt.length - 1];
            }
            let nameOption = optionN + '/' + optionG;
            if (config.pronouns.threeForms) {
                let thirdForms = (this.morphemes[MORPHEMES[2]] || '').split('&');
                if (config.locale === 'ru' || config.locale === 'ua') {
                    thirdForms = thirdForms.map(x => `[-${x}]`);
                }
                nameOption += '/' + thirdForms[i];
            } else if (this.thirdForm) {
                nameOption += '/' + this.morphemes[this.thirdForm].split('&')[i];
            }

            options.add(nameOption);
        }

        return [...options]
    }

    name(glue) {
        return this.nameOptions().join(glue)
    }

    clone(removeDescription = false) {
        return new Pronoun(
            this.canonicalName,
            removeDescription ? '' : this.description,
            this.normative,
            clone(this.morphemes),
            [...this.plural],
            [...this.pluralHonorific],
            [...this.aliases],
            this.history,
            this.pronounceable
        );
    }

    equals(other, ignoreBaseDescription = false) {
        return this.toString() === other.clone(ignoreBaseDescription).toString();
    }

    merge(other) {
        return new Pronoun(
            this.canonicalName + '&' + other.canonicalName,
            Array.isArray(this.description) ? [...this.description, other.description] : [this.description, other.description],
            this.normative && other.normative,
            buildDict(function* (that, other) {
                for (let morpheme of MORPHEMES) {
                    yield [morpheme, (that.morphemes[morpheme] || '') + '&' + (other.morphemes[morpheme] || '')]
                    //yield [morpheme, buildMorpheme(that.morphemes[morpheme], that.plural) + '&' + buildMorpheme(other.morphemes[morpheme], other.plural)]
                }
            }, this, other),
            [...this.plural, ...other.plural],
            [...this.pluralHonorific, ...other.pluralHonorific],
            [],
            '',
            false,
        );
    }

    getMorpheme(morpheme, counter = 0) {
        let capital = false;
        if (morpheme.startsWith("'")) {
            capital = true;
            morpheme = morpheme.substring(1);
        }

        if (!this.morphemes[morpheme]) {
            return null;
        }

        const options = this.morphemes[morpheme].split('&');

        const result = options[counter % options.length];

        return capital ? capitalise(result) : result;
    }

    getPronunciation(morpheme, counter = 0) {
        if (morpheme.startsWith("'")) {
            morpheme = morpheme.substring(1);
        }

        if (!this.pronunciations[morpheme]) {
            return null;
        }

        const options = this.pronunciations[morpheme].split('&');

        return options[counter % options.length];
    }

    isInterchangable(morpheme) {
        return (this.morphemes[morpheme.replace(/^'/, '')] || '').includes('&');
    }

    isPlural(counter = 0) {
        return this.plural[counter % this.plural.length]
    }

    isPluralHonorific(counter = 0) {
        return this.pluralHonorific[counter % this.pluralHonorific.length]
    }

    format(str) {
        return str.replace(/{[^}]+}/g, m => (this.morphemes[m.substring(1, m.length - 1)] || '').split('&')[0]);
    }

    toArray() {
        const elements = Object.values(this.morphemes).map(s => escape(s));
        // TODO #136
        // Object.values(this.pronunciations).forEach((p, i) => {
        //     if (p) {
        //         elements[i] += '|' + escape(p);
        //     }
        // });
        if (config.pronouns.plurals) {
            elements.push(this.plural.map(p => p ? 1 : 0).join(''));
            if (config.pronouns.honorifics) {
                elements.push(this.pluralHonorific.map(p => p ? 1 : 0).join(''));
            }
        }
        elements.push(escape(this.description));
        return elements;
    }

    toString() {
        return this.toArray().join(',');
    }

    toStringSlashes() {
        if (!config.pronouns.slashes || this.description) {
            return null;
        }

        return Object.values(this.morphemes).join('/');
    }

    static from(data) {
        let extraFields = 1; // description

        if (config.locale === 'pl') {
            if (['0', '1'].includes(data[data.length - 1])) {
                data.push(''); // description
            }

            if (data.length === 22) {
                data.splice(2, 0, data[4]);
                data.splice(8, 0, data[8]);
                data.splice(8, 0, data[8]);
            } else if (data.length === 23) {
                data.splice(2, 0, data[4]);
                data.splice(8, 0, data[8]);
            } else if (data.length === 24) {
                data.splice(2, 0, data[4]);
            }

            if (data.length < 30) {
                data = [
                    data[0],
                    data[1],
                    // g
                    data[2],
                    data[1],
                    data[1].replace(/^je/, 'nie'),
                    // d
                    data[4].replace(/^je/, ''),
                    data[4],
                    data[4].replace(/^je/, 'nie'),
                    // a
                    data[5].replace(/^je/, ''),
                    data[5],
                    data[5].replace(/^je/, 'nie'),
                    // rest
                    ...data.slice(6),
                ];
            }
        }

        if (config.pronouns.plurals) {
            extraFields += 1;
            if (![0, 1].includes(parseInt(data[MORPHEMES.length]))) {
                return null;
            }
            if (config.pronouns.honorifics) {
                extraFields += 1;
                if (![0, 1].includes(parseInt(data[MORPHEMES.length + 1]))) {
                    return null;
                }
            }
        }

        if (data.length === MORPHEMES.length + extraFields - 1) {
            data.push(''); // description
        }

        if (data.length !== MORPHEMES.length + extraFields
            || data[0].length === 0
            || data[data.length - 1].length > 64
            || data.slice(1, data.length - extraFields).filter(s => s.length > 24).length
        ) {
            return null;
        }

        const m = {}
        for (let i in MORPHEMES) {
            m[MORPHEMES[parseInt(i)]] = data[parseInt(i)];
        }

        return new Pronoun(
            m[MORPHEMES[0]],
            data[data.length - 1],
            false,
            m,
            config.pronouns.plurals ? data[MORPHEMES.length].split('').map(p => parseInt(p) === 1) : [false],
            config.pronouns.honorifics ? data[MORPHEMES.length + 1].split('').map(p => parseInt(p) === 1) : [false],
            [],
            '__generator__',
            false,
        )
    }
}

export class PronounGroup {
    constructor(name, pronouns, description = null, key = null) {
        this.name = name;
        this.pronouns = pronouns;
        this.description = description;
        this.key = key;
    }
}

export class PronounLibrary {
    constructor(groups, pronouns) {
        this.groups = groups;
        this.pronouns = pronouns;
        this.canonicalNames = Object.keys(this.pronouns);
    }

    *split(filter = null, includeOthers = true) {
        let pronounsLeft = Object.keys(this.pronouns);
        const that = this;

        for (let g of this.groups) {
            yield [g, buildList(function* () {
                for (let t of g.pronouns) {
                    pronounsLeft = pronounsLeft.filter(i => i !== t);
                    const pronoun = that.pronouns[t] || t;
                    if (!filter || filter(pronoun)) {
                        yield pronoun;
                    }
                }
            })];
        }

        if (!pronounsLeft.length || !includeOthers) {
            return;
        }

        yield [
            new PronounGroup(config.pronouns.others, pronounsLeft),
            buildList(function* () {
                for (let t of pronounsLeft) {
                    if (!filter || filter(that.pronouns[t])) {
                        yield that.pronouns[t];
                    }
                }
            }),
        ];
    }

    byKey() {
        const ret = {};
        for (let g of this.groups) {
            if (g.key === null) { continue; }
            if (ret[g.key] === undefined) { ret[g.key] = []; }

            const p = {};
            for (let t of g.pronouns) {
                const pronoun = this.pronouns[t];
                if (!pronoun) { continue; }
                p[pronoun.canonicalName] = pronoun;
            }

            ret[g.key].push({ group: g, groupPronouns: p});
        }
        return ret;
    }

    find(pronoun) {
        if (!pronoun) {
            return null;
        }

        for (let [group, groupPronouns] of this.split()) {
            for (let t of groupPronouns) {
                if (t.canonicalName === pronoun.canonicalName) {
                    return {group, groupPronouns};
                }
            }
        }
        return null;
    }

    isCanonical(pronoun) {
        for (let p of pronoun.split('&')) {
            if (!this.canonicalNames.includes(p)) {
                return false
            }
        }
        return true;
    }
}

export class Noun {
    constructor({id, masc, fem, neutr, mascPl, femPl, neutrPl, sources = null, sourcesData = [], approved = true, base_id = null, author = null, declension = null}) {
        this.id = id;
        this.masc = masc.split('|');
        this.fem = fem.split('|');
        this.neutr = neutr.split('|');
        this.mascPl = mascPl ? mascPl.split('|') : [];
        this.femPl = femPl ? femPl.split('|') : [];
        this.neutrPl = neutrPl ? neutrPl.split('|') : [];
        this.sources = sources ? sources.split(',') : [];
        this.sourcesData = sourcesData.filter(s => !!s).map(s => new Source(s));
        this.approved = !!approved;
        this.base = base_id;
        this.author = author;
        this.declension = declension;
    }

    matches(filter) {
        if (!filter) {
            return true;
        }

        for (let field of ['masc', 'fem', 'neutr', 'mascPl', 'femPl', 'neutrPl']) {
            for (let value of this[field]) {
                const v = value.toLowerCase();
                if (filter.startsWith('-') && v.endsWith(filter.substring(1))) {
                    return true;
                } else if (filter.endsWith('-') && v.startsWith(filter.substring(0, filter.length - 1))) {
                    return true;
                } else if (v.indexOf(filter.toLowerCase()) > -1) {
                    return true;
                }
            }
        }
        return false;
    }
}

export class NounTemplate {
    constructor(masc, fem, neutr, mascPl, femPl, neutrPl) {
        this.masc = masc;
        this.fem = fem;
        this.neutr = neutr;
        this.mascPl = mascPl;
        this.femPl = femPl;
        this.neutrPl = neutrPl;
    }

    fill(stem) {
        return {
            masc: this.masc.map(e => stem + e),
            fem: this.fem.map(e => stem + e),
            neutr: this.neutr.map(e => stem + e),
            mascPl: this.mascPl.map(e => stem + e),
            femPl: this.femPl.map(e => stem + e),
            neutrPl: this.neutrPl.map(e => stem + e),
            base: null,
        }
    }

    toString() {
        return Object.values(this)
            .map(es => es.map(e => '-' + e).join('/'))
            .join(', ')
            ;
    }
}


export class NounDeclension {
    constructor(endings) {
        this.singular = {}
        this.plural = {}
        for (let k in endings) {
            if (!endings.hasOwnProperty(k)) {
                continue;
            }
            const value = endings[k] ? endings[k].split('/') : null;
            if (k.endsWith('_pl')) {
                this.plural[k.substr(0, k.length - 3)] = value;
            } else {
                this.singular[k] = value;
            }
        }
    }

    matches(word, plural) {
        const plurality = plural ? 'plural' : 'singular';
        const rep = Object.keys(this[plurality])[0];
        for (let ending of this[plurality][rep] || []) {
            if (word.endsWith(ending)) {
                return ending.length;
            }
        }
        return 0;
    }

    hasSingular() {
        return Object.values(this.singular).filter(x => x !== null).length > 0;
    }

    hasPlural() {
        return Object.values(this.plural).filter(x => x !== null).length > 0;
    }

    decline(word, plural) {
        const plurality = plural ? 'plural' : 'singular';
        const rep = Object.keys(this[plurality])[0];
        const base = word.substring(0, word.length - this.matches(word, plural));
        const options = this[plurality];

        return buildDict(function*() {
            for (let k in options) {
                if (!options.hasOwnProperty(k)) {
                    continue;
                }
                yield [
                    k,
                    options[k].map(o => base + o),
                ];
            }
        });
    }
}


export class InclusiveEntry {
    constructor({id, insteadOf, say, because, author, approved = true, base_id = null, categories = '', links = '[]', clarification = null}) {
        this.id = id;
        this.insteadOf = insteadOf.split('|');
        this.say = say.split('|');
        this.because = because;
        this.author = author;
        this.approved = !!approved;
        this.base = base_id;
        this.categories = categories ? categories.split(',') : [];
        this.links = JSON.parse(links);
        this.clarification = clarification || null;
    }

    matches(filter) {
        if (!filter) {
            return true;
        }

        if (filter.startsWith(':')) {
            return this.categories.includes(filter.substring(1));
        }

        for (let field of ['insteadOf', 'say']) {
            for (let value of this[field]) {
                if (value.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                    return true;
                }
            }
        }
        return false;
    }
}

export class TermsEntry {
    constructor({id, term, original, key = null, definition, author, category = null, flags = '[]', images = '', approved = true, base_id = null, locale, versions = []}) {
        this.id = id;
        this.term = term.split('|');
        this.original = original ? original.split('|') : [];
        this.key = key || null;
        this.definition = definition;
        this.author = author;
        this.categories = category ? category.split(',') : [];
        this.flags = JSON.parse(flags);
        this.images = images ? images.split(',') : [];
        this.approved = !!approved;
        this.base = base_id;
        this.locale = locale;
        this.versions = versions.map(v => new TermsEntry(v));
    }

    matches(filter) {
        if (!filter) {
            return true;
        }

        if (filter.startsWith(':')) {
            return this.categories.includes(filter.substring(1));
        }

        if (this.key && this.key.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
            return true;
        }

        for (let field of ['term', 'original']) {
            for (let value of this[field]) {
                if (value.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                    return true;
                }
            }
        }
        return false;
    }
}

export class Name {
    constructor({id, name, origin, meaning, usage, legally, pros, cons, notablePeople, links, namedays, namedaysComment, approved, base_id = null, author = null}) {
        this.id = id;
        this.name = name;
        this.origin = origin;
        this.meaning = meaning;
        this.usage = usage;
        this.legally = legally;
        this.pros = pros ? pros.split('|') : [];
        this.cons = cons ? cons.split('|') : [];
        this.notablePeople = notablePeople ? notablePeople.split('|') : [];
        this.links = links ? links.split('|') : [];
        this.namedays = namedays ? namedays.split('|') : [];
        this.namedaysComment = namedaysComment;
        this.approved = !!approved;
        this.base = base_id;
        this.author = author;
    }

    matches(filter) {
        if (!filter) {
            return true;
        }

        for (let field of ['name', 'meaning']) {
            if ((this[field] || '').toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                return true;
            }
        }

        return false;
    }
}


export class Person {
    constructor(name, description, pronouns, sources = []) {
        this.name = name;
        this.description = description;
        this.pronouns = {};
        for (let p of pronouns) {
            const [language, display, link] = p.split(':');
            if (this.pronouns[language] === undefined) {
                this.pronouns[language] = [];
            }
            this.pronouns[language].push({display: display, link: link});
        }
        this.sources = sources;
    }
}
