import Suml from 'suml';
const fs = require('fs');
export default new Suml().parse(fs.readFileSync('./data/translations.suml').toString());
