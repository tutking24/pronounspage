import {mapState} from "vuex";
import zhConverter from "zh_cn_zh_tw";
import futurus from 'avris-futurus';
import {escapeHtml} from "../src/helpers";

export default {
    computed: {
        ...mapState([
            'spelling',
        ]),
    },
    methods: {
        handleSpelling(str) {
            if (this.config.locale === 'zh' && this.spelling === 'simplified') {
                return zhConverter.convertToSimplifiedChinese(str);
            }

            if (this.config.locale === 'pl' && this.spelling === 'futurysci') {
                return futurus.futuriseText(str);
            }

            if (this.config.locale === 'tok' && this.spelling === 'sitelen') {
                return '<span class="sitelen">' + str + '</span>';
            }

            return str;
        },
        convertName(name) {
            if (this.config.locale === 'tok') {
                const m = name.match(/^jan (.+?) \(((?:[mnptkswlj]?[iueoa][mn]? ?)+)\)$/i);
                if (!m) {
                    return escapeHtml(name);
                }

                if (this.spelling === 'sitelen') {
                    return `jan <span class="cartouche">${escapeHtml(m[2])}</span>`;
                }

                return `jan ${escapeHtml(m[1])}`;
            }

            return escapeHtml(name);
        },
    },
}
