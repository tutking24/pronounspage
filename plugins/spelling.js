import {mapState} from "vuex";
import zhConverter from "zh_cn_zh_tw";
import futurus from 'avris-futurus';

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
                    return name;
                }

                if (this.spelling === 'sitelen') {
                    return 'jan ' + m[2];
                }

                return 'jan ' + m[1];
            }

            return name;
        },
    },
}
