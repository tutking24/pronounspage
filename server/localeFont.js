import {registerFont} from "canvas";
import fs from 'fs';

const vars = {
    'fontHeadings': 'Quicksand',
    'fontText': 'Nunito'
};

// TODO(96): Fix this
// const zConfig = $zRouterData();
/*for (let [, name, value] of fs.readFileSync(`${__dirname}/../locale/${zConfig.locale}/variables.scss`).toString('utf-8').matchAll(/^\$([^:]+): '([^']+)';$/gm)) {
    vars[name] = value;
}*/

const fontSources = {
    'Quicksand': 'quicksand-v21-latin-ext_latin-{weight}.ttf',
    'Nunito': 'nunito-v16-latin-ext_latin_cyrillic-ext_cyrillic-{weight}.ttf',
    'Zen Maru Gothic': 'zen-maru-gothic-v4-latin_japanese-{weight}.ttf',
}

const weightsValues = {
    'bold': '700',
}

export const registerLocaleFont = (v, weights = ['regular']) => {
    const family = vars[v];
    const source = fontSources[family];
    for (let weight of weights) {
        registerFont('static/fonts/' + source.replace('{weight}', weightsValues[weight] || weight), {family, weight});
    }
    return family;
}
