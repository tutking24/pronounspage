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
    if (!path) {
        return null;
    }

    const config = global.config || process.env.CONFIG;

    for (let prefix of config.pronouns.sentence ? config.pronouns.sentence.prefixes : []) {
        if (('/' + path).startsWith(prefix + '/')) {
            path = path.substring(prefix.length);
            break;
        }
    }

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
    if (base) {
        base = base.toArray();
    }
    // i know, it's ugly… didn't think about BC much and now it's a huge mess…
    const pronounStrLen = pronounStr.map(x => x.startsWith('!') ? parseInt(x.substring(1)) : 1).reduce((c, a) => c + a, 0);
    if (config.locale === 'pl' && base && pronounStrLen < 30) {
        base = [
            ...base.slice(0, 4),
            base[5],
            base[8],
            ...base.slice(11)
        ];
    }

    let pronoun = pronounStr.length === 1
        ? base
        : Pronoun.from(Compressor.uncompress(pronounStr, base, config.locale));

    if (!config) {
        return pronoun;
    }

    if (!pronoun && config.pronouns.emoji !== false && isEmoji(path)) {
        pronoun = buildPronounFromTemplate(path, config.pronouns.emoji);
    }

    if (!pronoun && config.pronouns.null && config.pronouns.null.morphemes && path.startsWith(':') && path.length < 12) {
        pronoun = buildPronounFromTemplate(path.substring(1), config.pronouns.null);
    }

    const p = path.split('/').filter(s => !!s);
    if (!pronoun && config.pronouns.slashes !== false) {
        const slashMorphemes = config.pronouns.slashes === true
            ? MORPHEMES
            : config.pronouns.slashes;
        if (slashMorphemes && p.length === slashMorphemes.length) {
            pronoun = new Pronoun(
                `${p[0]}/${p[1]}`,
                '',
                false,
                buildDict(function*() {
                    for (let m of MORPHEMES) {
                        const index = slashMorphemes.indexOf(m)
                        yield [m, index === -1 ? '' : p[index]];
                    }
                }),
                [ p[p.length - 1].endsWith('selves') ],  // TODO English specific, extract somewhere
                [ false ],
                [],
                '__generator__',
                false,
            )
        }
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

