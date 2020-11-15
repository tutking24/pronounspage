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

export const buildPronoun = (pronouns, path) => {
    const pronounsWithAliases = addAliasesToPronouns(pronouns);

    const pronounStr = path.split(',');

    let base = null;
    for (let option of pronounStr[0].split('&')) {
        if (!base) {
            base = pronounsWithAliases[option]
        } else {
            base = base.merge(pronounsWithAliases[option])
        }
    }

    let pronoun = pronounStr.length === 1
        ? base
        : Pronoun.from(Compressor.uncompress(pronounStr, base ? base.toArray() : null));

    if (!pronoun && process.env.CONFIG.pronouns.emoji !== false && isEmoji(path)) {
        pronoun = buildPronounFromTemplate(path, process.env.CONFIG.pronouns.emoji);
    }

    if (!pronoun && process.env.CONFIG.pronouns.null !== false && path.startsWith(':') && path.length < 12) {
        pronoun = buildPronounFromTemplate(path.substring(1), process.env.CONFIG.pronouns.null);
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
                    t.sources ? t.sources.split(',') : [],
                    aliases.slice(1),
                    t.history,
                )
            ];
        }
    });
}

export const buildPronounFromTemplate = (key, template) => {
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
        template.plural || false,
        template.pluralHonorific || false,
        template.sources || [],
        template.aliases || [],
        template.history || null,
    )
}
