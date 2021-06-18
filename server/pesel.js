const Papa = require('papaparse');
const fs = require('fs');

const loadTsv = name => Papa.parse(fs.readFileSync(name).toString(), {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    delimiter: '\t',
}).data;

const _each = (obj, callable) => {
    const ret = [];

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            ret.push(callable(obj[key], key));
        }
    }

    return ret;
};

const peselK1 = loadTsv('./data/names/K1.tsv');
const peselK2 = loadTsv('./data/names/K2.tsv');
const peselM1 = loadTsv('./data/names/M1.tsv');
const peselM2 = loadTsv('./data/names/M2.tsv');

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

const calculateBalance = (k, m) => {
    const balance = k / (k + m);
    return balance > 0.5
        ? 1 - balance
        : balance;
}

const allUnisex = {};
const popularUnisex = {};

const allFirstUnisex = {};
const popularFirstUnisex = {};

_each(pesel, (counts, name) => {
    counts['balanceBoth'] = calculateBalance(counts.K[0] + counts.K[1], counts.M[0] + counts.M[1]);
    counts['balanceFirst'] = calculateBalance(counts.K[0], counts.M[0]);
    counts['balanceBothPop'] = counts['balanceBoth'] * (counts.K[0] + counts.K[1] + counts.M[0] + counts.M[1]);
    counts['balanceFirstPop'] = counts['balanceFirst'] * (counts.K[0] + counts.M[0]);
});

let maxBalanceBoth = {balance: 0, name: ''};
let maxBalanceBothPop = {balance: 0, name: ''};
let maxBalanceFirst = {balance: 0, name: ''};
let maxBalanceFirstPop = {balance: 0, name: ''};

const popularMin = 100;

_each(pesel, (counts, name) => {
    if (counts.K[0] + counts.K[1] > 0 && counts.M[0] + counts.M[1] > 0) {
        allUnisex[name] = counts;
    }

    if (counts.K[0] + counts.K[1] >= popularMin && counts.M[0] + counts.M[1] >= popularMin) {
        popularUnisex[name] = counts;
        if (counts['balanceBoth'] > maxBalanceBoth.balance) {
            maxBalanceBoth = {balance: counts['balanceBoth'], name: name};
        }
    }
    if (counts['balanceBothPop'] > maxBalanceBothPop.balance) {
        maxBalanceBothPop = {balance: counts['balanceBothPop'], name: name};
    }

    if (counts.K[0] > 0 && counts.M[0] > 0) {
        allFirstUnisex[name] = counts;
    }

    if (counts.K[0] >= popularMin && counts.M[0] >= popularMin) {
        popularFirstUnisex[name] = counts;
        if (counts['balanceFirst'] > maxBalanceFirst.balance) {
            maxBalanceFirst = {balance: counts['balanceFirst'], name: name};
        }
    }
    if (counts['balanceFirstPop'] > maxBalanceFirstPop.balance) {
        maxBalanceFirstPop = {balance: counts['balanceFirstPop'], name: name};
    }
});

const buildTable = (names, both, sortBy) => {
    names = _each(names, (counts, name) => { return {name, counts} }).sort((a, b) => {
        return b.counts[sortBy] - a.counts[sortBy];
    })

    let table = `<div class="table-wide table-responsive"><table class="table table-sm table-striped"><tr class="sticky-top">`;
    table += `<th data-sort><span class="fal fa-signature"></span> Imię</th>`;
    table += `<th data-sort="number"><span class="fal fa-venus"></span> Kobiety${both ? ' <small>(pierwsze imię)' : ''}</small></th>`;
    if (both) {
        table += `<th data-sort="number"><span class="fal fa-venus"></span> Kobiety <small>(drugie imię)</small></th>`;
    }
    table += `<th data-sort="number"><span class="fal fa-mars"></span> Mężczyźni${both ? ' <small>(pierwsze imię)' : ''}</th>`;
    if (both) {
        table += `<th data-sort="number"><span class="fal fa-mars"></span> Mężczyźni <small>(drugie imię)</small></th>`;
    }
    table += `<th data-sort="number"><span class="fal fa-balance-scale"></span> Balans</th>`;
    table += `<th data-sort="number" data-sort-auto="desc"><span class="fal fa-trophy"></span> Balans × popularność</th>`;
    table += `</tr>`;
    for (let {name, counts} of names) {
        table += `<tr>`;
        table += `<td>${name}</td>`;
        table += `<td>${counts.K[0]}</td>`;
        if (both) {
            table += `<td>${counts.K[1]}</td>`;
        }
        table += `<td>${counts.M[0]}</td>`;
        if (both) {
            table += `<td>${counts.M[1]}</td>`;
        }
        table += `<td>${counts[both ? 'balanceBoth' : 'balanceFirst'].toFixed(3)}</td>`;
        table += `<td>${counts[both ? 'balanceBothPop' : 'balanceFirstPop'].toFixed(0)}</td>`;
        table += `</tr>`;
    }
    table += `</table ></div>`;

    return table;
}

const buildList = (names) => {
    return Object.keys(names).sort().join(', ');
}

console.log('Oba imiona:')
console.log(Object.keys(allUnisex).length);
console.log(buildList(allUnisex));
console.log(Object.keys(popularUnisex).length);
console.log(buildTable(popularUnisex, true, 'balanceBothPop'))
console.log('Max balans', maxBalanceBoth, maxBalanceBothPop)
// console.log(popularUnisex);

console.log('Pierwsze imiona:')
console.log(Object.keys(allFirstUnisex).length);
console.log(buildList(allFirstUnisex));
console.log(Object.keys(popularFirstUnisex).length);
console.log(buildTable(popularFirstUnisex, false, 'balanceFirstPop'))
console.log('Max balans', maxBalanceFirst, maxBalanceFirstPop)
// console.log(popularFirstUnisex);

console.log(allUnisex['ALEX'])
console.log(allUnisex['ALEKS'])
