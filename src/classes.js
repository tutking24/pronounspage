import {buildDict, buildList} from "./helpers";
import MORPHEMES from '../data/morphemes';

export class ExamplePart {
    constructor(variable, str) {
        this.variable = variable;
        this.str = str;
    }

    format(form) {
        if (!this.variable) {
            return this.str[form.plural];
        }

        return form[this.str[form.plural]];
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

        for (let m of str.matchAll(/{([a-z_]+)}/g)) {
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

    format(form) {
        return Example.ucfirst(this.parts.map(part => part.format(form)).join(''));
    }

    static ucfirst(str) {
        return str[0].toUpperCase() + str.slice(1);
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
    constructor (type, author, title, extra, year, fragments = [], comment = null, link = null) {
        this.type = type;
        this.author = author;
        this.title = title;
        this.extra = extra;
        this.year = year;
        this.fragments = fragments;
        this.comment = comment;
        this.link = link;
    }

    static get TYPES() {
        return {
            '': 'clipboard-list',
            Book: 'book-open',
            Article: 'newspaper',
            // Movie: 'film',
            Series: 'tv',
            Song: 'music',
            Poetry: 'scroll',
            Other: 'comment-alt-lines',
        }
    }

    icon() {
        return Source.TYPES[this.type];
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

export class Template {
    constructor (canonicalName, description, normative, morphemes, plural, pluralHonorific, sources = [], aliases = [], history = null) {
        this.canonicalName = canonicalName;
        this.description = description;
        this.normative = normative;
        this.morphemes = morphemes
        this.plural = plural;
        this.pluralHonorific = pluralHonorific;
        this.sources = sources;
        this.aliases = aliases;
        this.history = history;
    }

    pronoun() {
        return this.morphemes[MORPHEMES[0]];
    }

    nameOptions() {
        const options = new Set();
        const optionsN = this.morphemes[MORPHEMES[0]].split('&');
        const optionsG = this.morphemes[MORPHEMES[1]].split('&');
        for (let i in optionsN) {
            options.add(optionsN[i] + '/' + optionsG[i < optionsG.length - 1 ? i : optionsG.length - 1]);
        }

        return [...options]
    }

    name(glue) {
        return this.nameOptions().join(glue)
    }

    clone() {
        return new Template(this.canonicalName, this.description, this.normative, clone(this.morphemes), this.plural, this.pluralHonorific);
    }

    equals(other) {
        return this.toString() === other.toString();
    }

    merge(other) {
        if (this.plural !== other.plural || this.pluralHonorific !== other.pluralHonorific) {
            // Cannot mix plurality
            return null;
        }

        return new Template(
            this.canonicalName + '&' + other.canonicalName,
            Array.isArray(this.description) ? [...this.description, other.description] : [this.description, other.description],
            this.normative && other.normative,
            buildDict(function* (that, other) {
                for (let morpheme of MORPHEMES) {
                    yield [morpheme, (that.morphemes[morpheme] || '') + '&' + (other.morphemes[morpheme] || '')]
                }
            }, this, other),
            this.plural,
            this.pluralHonorific,
        );
    }

    getMorpheme(morpheme, counter = 0) {
        if (!this.morphemes[morpheme]) {
            return null;
        }

        const options = this.morphemes[morpheme].split('&');

        return options[counter % options.length]
    }

    toArray() {
        return [
            ...Object.values(this.morphemes).map(s => escape(s)),
            this.plural ? 1 : 0,
            this.pluralHonorific ? 1 : 0,
            escape(this.description),
        ];
    }

    toString() {
        return this.toArray().join(',');
    }

    static from(data) {
        if (data.length === MORPHEMES.length + 2) {
            data.push('');
        }

        if (data.length !== MORPHEMES.length + 3
            || data[0].length === 0
            || data[data.length - 1].length > 48
            || ![0, 1].includes(parseInt(data[MORPHEMES.length]))
            || ![0, 1].includes(parseInt(data[MORPHEMES.length + 1]))
            || data.slice(1, data.length - 3).filter(s => s.length > 12).length
        ) {
            return null;
        }

        const m = {}
        for (let i in MORPHEMES) {
            m[MORPHEMES[parseInt(i)]] = data[parseInt(i)];
        }

        return new Template(m[MORPHEMES[0]], data[data.length - 1], false, m, parseInt(data[MORPHEMES.length]) === 1, parseInt(data[MORPHEMES.length + 1]) === 1)
    }
}

export class TemplateGroup {
    constructor(name, templates, description = null) {
        this.name = name;
        this.templates = templates;
        this.description = description;
    }
}

export class TemplateLibrary {
    constructor(groups, templates) {
        this.groups = groups;
        this.templates = templates;
    }

    *split(filter = null, includeOthers = true) {
        let templatesLeft = Object.keys(this.templates);
        const that = this;

        for (let g of this.groups) {
            yield [g, buildList(function* () {
                for (let t of g.templates) {
                    templatesLeft = templatesLeft.filter(i => i !== t);
                    const template = that.templates[t] || t;
                    if (!filter || filter(template)) {
                        yield template;
                    }
                }
            })];
        }

        if (!templatesLeft.length || !includeOthers) {
            return;
        }

        yield [
            new TemplateGroup('Inne formy', templatesLeft),
            buildList(function* () {
                for (let t of templatesLeft) {
                    if (!filter || filter(that.templates[t])) {
                        yield that.templates[t];
                    }
                }
            }),
        ];
    }

    find(template) {
        if (template === undefined) {
            return null;
        }

        for (let [group, groupTemplates] of this.split()) {
            for (let t of groupTemplates) {
                if (t.canonicalName === template.canonicalName) {
                    return {group, groupTemplates};
                }
            }
        }
        return null;
    }
}

export class Noun {
    constructor({id, masc, fem, neutr, mascPl, femPl, neutrPl, approved, base_id}) {
        this.id = id;
        this.masc = masc.split('|');
        this.fem = fem.split('|');
        this.neutr = neutr.split('|');
        this.mascPl = mascPl.split('|');
        this.femPl = femPl.split('|');
        this.neutrPl = neutrPl.split('|');
        this.approved = !!approved;
        this.base = base_id;
    }

    matches(filter) {
        if (!filter) {
            return true;
        }

        for (let field of ['masc', 'fem', 'neutr', 'mascPl', 'femPl', 'neutrPl']) {
            for (let value of this[field]) {
                if (value.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
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

export class Name {
    constructor(name, origin, meaning, usage, legally, pros, cons, notablePeople, count, links) {
        this.name = name;
        this.origin = origin;
        this.meaning = meaning;
        this.usage = usage;
        this.legally = legally;
        this.pros = pros;
        this.cons = cons;
        this.notablePeople = notablePeople;
        this.count = count; // TODO
        this.links = links.filter(l => l.trim().length);
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
