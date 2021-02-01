import {mapState} from "vuex";
import zhConverter from "zh_cn_zh_tw";

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

            return str;
        }
    },
}
