import {buildDict} from "./helpers";

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
            Article: { icon:'newspaper', text: 'Prasa' },
            // Movie: { icon:'film', text: 'Filmy' },
            Series: { icon:'tv', text: 'Seriale' },
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
    constructor (description, morphemes, plural, pluralHonorific, sources = [], aliases = [], history = null) {
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
        return new Template(this.description, clone(this.morphemes), this.plural, this.pluralHonorific);
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

        return new Template(data[data.length - 1], m, parseInt(data[MORPHEMES.length]) === 1, parseInt(data[MORPHEMES.length + 1]) === 1)
    }
}
