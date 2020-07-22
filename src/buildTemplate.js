import {Template} from "./classes";
import Compressor from "./compressor";
import {templates} from "./data";

export default (path) => {
    const templateStr = path.split(',');
    const base = templates[templateStr[0]]

    return templateStr.length === 1
        ? templates[templateStr[0]]
        : Template.from(Compressor.uncompress(templateStr, base ? base.toArray() : null));
}
