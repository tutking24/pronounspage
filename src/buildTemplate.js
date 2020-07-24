import {Template} from "./classes";
import Compressor from "./compressor";
import {templates} from "./data";

const templatesWithAliases = {}
for (let base in templates) {
    if (templates.hasOwnProperty(base)) {
        const template = templates[base];
        templatesWithAliases[base] = template;
        for (let alias of template.aliases) {
            templatesWithAliases[alias] = template;
        }
    }
}

export const getTemplate = (id) => {
    return templatesWithAliases[id];
}

export const buildTemplate = (path) => {
    const templateStr = path.split(',');
    const base = templatesWithAliases[templateStr[0]]

    return templateStr.length === 1
        ? templatesWithAliases[templateStr[0]]
        : Template.from(Compressor.uncompress(templateStr, base ? base.toArray() : null));
}
