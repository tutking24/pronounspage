<template>
    <span>
        <slot ref="source"></slot>
    </span>
</template>

<!--
<template>
    <span>
        <span ref="source" v-show="false">
            <slot ref="source"></slot>
        </span>
        <span ref="target"></span>
    </span>
</template>

<script>
import twemoji from 'twemoji';

export default {
    mounted() {
        this.update();

        const observer = new MutationObserver(this.update);
        observer.observe(this.$refs.source, {
            childList: true,
            subtree: true
        });
        this.observer = observer;
    },
    beforeUnmount() {
        this.observer.disconnect();
    },
    methods: {
        update() {
            this.$refs.target.innerHTML = twemoji.parse(this.$refs.source.innerHTML);
        },
    },
};
</script>

<style lang="scss">
.emoji {
    height: 1em;
}
</style>
-->
