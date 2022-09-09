<template>
    <div>
        <div v-html="svg" :class="border ? 'border' : ''" ref="svg"/>
        <button v-if="download && svg" class="btn btn-outline-primary btn-sm m-3" @click.prevent="generateDownload" :disabled="generating">
            <Spinner v-if="generating"/>
            <template v-else>
                <Icon v="download"/>
                <T>user.qr.download</T>
            </template>
        </button>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {makeId} from "../src/helpers";

const primary = '#C71585';
const primaryDark = '#810e57'
const primaryLight = '#ff95bb';
const light = '#F8F9FA';
const dark = '#212529';

export default {
    props: {
        url: { required: true },
        text1: { },
        text2: { },
        download: { type: Boolean },
        border: { type: Boolean },
    },
    data() {
        return {
            id: makeId(6),
            QRCodeStyling: undefined,
            html2canvas: undefined,
            svg: undefined,
            generating: false,
        }
    },
    mounted() {
        if (!process.client) { return; }

        this.render();
    },
    methods: {
        async render() {
            this.QRCodeStyling = this.QRCodeStyling || (await import('qr-code-styling')).default;

            const qrCode = new this.QRCodeStyling({
                type: 'svg',
                data: this.url,
                image: `/logo/logo-${this.darkMode ? 'light' : 'primary'}.svg`,
                dotsOptions: {
                    color: this.darkMode ? light : primary,
                    type: 'extra-rounded',
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                    color: this.darkMode ? primaryLight : primaryDark,
                },
                cornersDotOptionsHelper: {
                    color: this.darkMode ? primaryLight : primaryDark,
                },
                backgroundOptions: {
                    color: this.darkMode ? dark : light,
                },
                margin: 8,
            });

            this.svg = (await (await qrCode.getRawData('svg')).text())
                .replace('<?xml version="1.0" standalone="no"?>', '')
                .replace('width="300" height="300"', `viewBox="0 0 300 ${this.text1 ? 370 : 300}" shape-rendering="geometricPrecision"`)
                .replace(/id="/g, `id="${this.id}-`)
                .replace(/'#/g, `'#${this.id}-`)
            ;
            if (this.text1) {
                this.svg = this.svg.replace('</svg>', `
                    <text x="150" y="316" dominant-baseline="middle" text-anchor="middle" stroke="none"
                        fill="${this.darkMode ? primaryLight : primary}" font-size="1.5em">${this.text1}</text>
                    <text x="150" y="346" dominant-baseline="middle" text-anchor="middle" stroke="none"
                        fill="${this.darkMode ? primaryLight : primary}" font-size="1.8em" font-weight="bold">${this.text2}</text>
                </svg>`)
                    .replace('<rect x="0" y="0" height="300" width="300"', '<rect x="0" y="0" height="370" width="300"');
            }
        },
        async generateDownload() {
            if (this.generating) { return; }
            this.generating = true;

            this.html2canvas = this.html2canvas || (await import('html2canvas')).default;

            this.html2canvas(this.$refs.svg).then((canvas) => {
                const dlLink = document.createElement('a');
                dlLink.download = 'image';
                dlLink.href = canvas.toDataURL('image/png');
                dlLink.dataset.downloadurl = ['image/png', dlLink.download, dlLink.href].join(':');

                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);

                this.generating = false;
            });
        }
    },
    computed: {
        ...mapState([
            'darkMode',
        ]),
    },
    watch: {
        darkMode() {
            this.render();
        },
    }
}
</script>
