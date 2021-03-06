import { Pronoun } from "./classes";
import Compressor from "./compressor";
import {buildDict, isEmoji} from "./helpers";
import MORPHEMES from '../data/pronouns/morphemes';

export const addAliasesToPronouns = (pronouns) => {
    const pronounsWithAliases = {}
    for (let base in pronouns) {
        if (pronouns.hasOwnProperty(base)) {
            const pronoun = pronouns[base];
            pronounsWithAliases[base] = pronoun;
            for (let alias of pronoun.aliases) {
                pronounsWithAliases[alias] = pronoun;
            }
        }
    }
    return pronounsWithAliases;
}

export const getPronoun = (pronouns, id) => {
    return addAliasesToPronouns(pronouns)[id];
}

const buildPronounFromTemplate = (key, template) => {
    return new Pronoun(
        key,
        template.description,
        template.normative || false,
        buildDict(function*(morphemes) {
            for (let k in morphemes) {
                if (morphemes.hasOwnProperty(k)) {
                    yield [k, morphemes[k].replace(/#/g, key)];
                }
            }
        }, template.morphemes),
        [template.plural || false],
        [template.pluralHonorific || false],
        template.aliases || [],
        ((template.history || '') + '@__generator__').replace(/^@/, ''),
        false,
    );
}

export const buildPronoun = (pronouns, path) => {
    const pronounsWithAliases = addAliasesToPronouns(pronouns);

    const pronounStr = path.split(',');

    let base = null;
    for (let option of pronounStr[0].split('&')) {
        if (!base) {
            base = pronounsWithAliases[option]
        } else if (pronounsWithAliases[option]) {
            base = base.merge(pronounsWithAliases[option])
        }
    }

    let pronoun = pronounStr.length === 1
        ? base
        : Pronoun.from(Compressor.uncompress(pronounStr, base ? base.toArray() : null));

    if (!process.env.CONFIG) {
        return pronoun;
    }

    if (!pronoun && process.env.CONFIG.pronouns.emoji !== false && isEmoji(path)) {
        pronoun = buildPronounFromTemplate(path, process.env.CONFIG.pronouns.emoji);
    }

    if (!pronoun && process.env.CONFIG.pronouns.null !== false && path.startsWith(':') && path.length < 12) {
        pronoun = buildPronounFromTemplate(path.substring(1), process.env.CONFIG.pronouns.null);
    }

    const p = path.split('/').filter(s => !!s);
    if (!pronoun && process.env.CONFIG.pronouns.slashes !== false && p.length === MORPHEMES.length) {
        pronoun = new Pronoun(
            `${p[0]}/${p[1]}`,
            '',
            false,
            buildDict(function*() {
                let i = 0;
                for (let m of MORPHEMES) {
                    yield [m, p[i++]];
                }
            }),
            [ p[p.length - 1].endsWith('selves') ],  // TODO English specific, extract somewhere
            [ false ],
            [],
            '__generator__',
            false,
        )
    }

    return pronoun;
}

export const parsePronouns = (pronounsRaw) => {
    return buildDict(function* () {
        for (let t of pronounsRaw) {
            const aliases = t.key.split(',');

            yield [
                aliases[0],
                new Pronoun(
                    aliases[0],
                    t.description,
                    t.normative,
                    buildDict(function* () {
                        for (let morpheme of MORPHEMES) {
                            yield [morpheme, t[morpheme]];
                        }
                    }),
                    [t.plural],
                    [t.pluralHonorific],
                    aliases.slice(1),
                    t.history,
                    t.pronounceable,
                    t.thirdForm,
                    t.smallForm,
                    t.sourcesInfo,
                )
            ];
        }
    });
}

