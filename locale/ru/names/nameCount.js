// Database of names
// source: https://dane.gov.pl/dataset/1667,lista-imion-wystepujacych-w-rejestrze-pesel-osoby-zyjace
// update: yearly, in January

import peselK1 from './K1.tsv';
import peselK2 from './K2.tsv';
import peselM1 from './M1.tsv';
import peselM2 from './M2.tsv';

const pesel = {}
for (let [names, sex, ordinal] of [
    [peselK1, 'K', 1],
    [peselK2, 'K', 2],
    [peselM1, 'M', 1],
    [peselM2, 'M', 2],
]) {
    for (let {name, count} of names) {
        if (pesel[name] === undefined) {
            pesel[name] = {K: [0, 0], M: [0, 0]};
        }
        pesel[name][sex][ordinal - 1] = count;
    }
}

export default pesel;
