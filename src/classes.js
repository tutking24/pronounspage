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
    constructor(singularParts, pluralParts) {
        this.parts = {
            false: singularParts,
            true: pluralParts,
        };
    }

    static parse(str) {
        const versions = str.split('|');
        return new Example(
            Example._parse(versions[0]),
            Example._parse(versions[versions.length > 1 ? 1 : 0])
        );
    }

    static _parse(str) {
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
    constructor (author, title, extra, year, fragments = [], comment = null, link = null) {
        this.author = author;
        this.title = title;
        this.extra = extra;
        this.year = year;
        this.fragments = fragments;
        this.comment = comment;
        this.link = link;
    }

    icon() {
        return 'circle';
    }
}

export class Book extends Source {
    icon() {
        return 'book-open';
    }
}

export class Article extends Source {
    icon() {
        return 'newspaper';
    }
}

export class Movie extends Source {
    icon() {
        return 'film';
    }
}

export class Series extends Source {
    icon() {
        return 'tv';
    }
}

export const morphemes = [
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
    return (s || '')
        .replace(',', '')
        .replace('!', '')
        .replace('.', '')
        //.replace('/', '%2F')
        .replace('#', '%23')
        .replace('?', '%3F')
        .replace('&', '%26');
}

export class Template {
    constructor (description, morphemes, plural, sources = [], aliases = [], history = null) {
        this.description = description;
        this.morphemes = morphemes
        this.plural = plural;
        this.sources = sources;
        this.aliases = aliases;
        this.history = history;
    }

    pronoun() {
        return this.morphemes['pronoun_n'];
    }

    name() {
        return this.morphemes['pronoun_n'] + '/' + this.morphemes['pronoun_g'];
    }

    clone() {
        return new Template(this.description, clone(this.morphemes), this.plural);
    }

    equals(other) {
        return this.toString() === other.toString();
    }

    toArray() {
        return [
            ...Object.values(this.morphemes).map(s => escape(s)),
            this.plural ? 1 : 0,
            escape(this.description),
        ];
    }

    toString() {
        return this.toArray().join(',');
    }

    static from(data) {
        if (data.length === morphemes.length + 1) {
            data.push('');
        }

        if (data.length !== morphemes.length + 2
            || data[0].length === 0
            || data[data.length - 1].length > 48
            || data[data.length - 2].length === 0
            || ![0, 1].includes(parseInt(data[morphemes.length]))
            || data.slice(1, data.length - 2).filter(s => s.length > 7).length
        ) {
            return null;
        }

        const m = {}
        for (let i in morphemes) {
            m[morphemes[parseInt(i)]] = data[parseInt(i)];
        }

        return new Template(data[data.length - 1], m, parseInt(data[morphemes.length]) === 1)
    }
}
