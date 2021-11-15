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

            return str;
        }
    },
}
