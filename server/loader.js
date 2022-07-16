const fs = require('fs');
import Suml from 'suml';
import Papa from 'papaparse';

// TODO(96): Fix this
export const loadSuml = name => new Suml().parse(fs.readFileSync(`./locale/en/${name}.suml`).toString());

export const loadTsv = name => Papa.parse(fs.readFileSync(`./locale/en/${name}.tsv`).toString(), {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    delimiter: '\t',
}).data;
