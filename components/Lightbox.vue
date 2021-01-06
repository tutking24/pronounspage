<template>
    <div :class="['lightbox-wrapper', currentUrl === null ? 'd-none' : '']" ref="wrapper" @click.self="hide">
        <div :class="['lightbox-inner', center ? 'align-items-center' : '']" ref="inner" @click.self="hide">
            <img class="lightbox-image" :src="currentUrl" ref="image" @load="loaded">
        </div>
        <span class="lightbox-menu">
            <span class="lightbox-close fal fa-times" @click="hide"></span>
        </span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentUrl: null,
                center: false,
            };
        },
        mounted() {
            this.$eventHub.$on('lightbox', this.show);

            if (!process.client) {
                return;
            }

            document.addEventListener('resize', e => {
                if (!this.currentUrl) {
                    return;
                }
                this.center = this.$refs.image.offsetHeight < this.$refs.inner.offsetHeight;
            });

            document.body.addEventListener('keyup', e => {
                if (!this.currentUrl) {
                    return;
                }

                if (e.keyCode === 27) { // ESC
                    this.hide();

                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        },
        methods: {
            show(url) {
                this.currentUrl = url;
                this.$refs.inner.focus();
            },
            hide() {
                this.currentUrl = null;
                this.$refs.inner.blur();
                this.center = false;
            },
            loaded() {
                if (this.$refs.image.offsetHeight < this.$refs.inner.offsetHeight) {
                    this.center = true;
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import "../assets/style";

    .lightbox-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        z-index: 10000;

        padding: 2*$spacer 2*$spacer;
        @include media-breakpoint-up('sm') {
            padding: 2*$spacer 4*$spacer;
        }

        .lightbox-inner {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            display: flex;
            justify-content: center;
            align-items: flex-start;

            img {
                max-width: 100%;
            }
        }

        .lightbox-menu {
            position: absolute;
            top: $spacer;
            right: $spacer;
            font-size: 2*$spacer;
            color: $white;
        }

        .lightbox-close {
            cursor: pointer;
        }
    }
</style>
