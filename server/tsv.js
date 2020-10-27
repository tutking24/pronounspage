import Papa from 'papaparse';
import fs from "fs";

export const loadTsv = (filename) => {
    return Papa.parse(fs.readFileSync(filename).toString('utf-8'), {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
    }).data;
};
