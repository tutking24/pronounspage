const fs = require('fs');
import Suml from 'suml';
import Papa from 'papaparse';

export const loadSuml = (name: string) => new Suml().parse(fs.readFileSync(`./data/${name}.suml`).toString());

export const loadTsv = (name: string) => Papa.parse(fs.readFileSync(`./data/${name}.tsv`).toString(), {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    delimiter: '\t',
}).data;
