import {buildDict, buildList} from "./helpers";

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
            '': { icon: 'clipboard-list', text: 'Wszystkie' },
            Book: { icon: 'book-open', text: 'Książki' },
            Article: { icon: 'newspaper', text: 'Prasa' },
            // Movie: { icon:'film', text: 'Filmy' },
            Series: { icon: 'tv', text: 'Seriale' },
            Song: { icon: 'music', text: 'Muzyka' },
            Poetry: { icon: 'scroll', text: 'Poezja' },
            Other: { icon: 'comment-alt-lines', text: 'Inne' },
        }
    }

    icon() {
        return Source.TYPES[this.type].icon;
    }
}

export const MORPHEMES = [
    'pronoun_n',
    'pronoun_g',
    'pronoun_g_acc',
    'pronoun_d',
    'pronoun_a',
    'pronoun_i',
    'pronoun_l',
    'pronoun_all',
    'adjective_n',
    'adjective_ll',
    'adjective_middle',
    'verb_end_inter',
    'verb_end_about',
    'verb_middle',
    'verb_nasal',
    'verb_go',
    'verb_o',
    'honorific',
];

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
    constructor (canonicalName, description, morphemes, plural, pluralHonorific, sources = [], aliases = [], history = null) {
        this.canonicalName = canonicalName;
        this.description = description;
        this.morphemes = morphemes
        this.plural = plural;
        this.pluralHonorific = pluralHonorific;
        this.sources = sources;
        this.aliases = aliases;
        this.history = history;
    }

    pronoun() {
        return this.morphemes['pronoun_n'];
    }

    nameOptions() {
        const options = new Set();
        const optionsN = this.morphemes.pronoun_n.split('&');
        const optionsG = this.morphemes.pronoun_g.split('&');
        for (let i in optionsN) {
            options.add(optionsN[i] + '/' + optionsG[i < optionsG.length - 1 ? i : optionsG.length - 1]);
        }

        return [...options]
    }

    name(glue = ' lub ') {
        return this.nameOptions().join(glue)
    }

    clone() {
        return new Template(this.canonicalName, this.description, clone(this.morphemes), this.plural, this.pluralHonorific);
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

        return new Template(m.pronoun_n, data[data.length - 1], m, parseInt(data[MORPHEMES.length]) === 1, parseInt(data[MORPHEMES.length + 1]) === 1)
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
                if (value.indexOf(filter) > -1) {
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
