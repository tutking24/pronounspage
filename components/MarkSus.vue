<template>
    <span>
        <span ref="original" v-show="!$isGranted('users')">
            <slot ref="original"></slot>
        </span>
        <span ref="marked" v-show="$isGranted('users')"></span>
    </span>
</template>

<script>
export default {
    data() {
        return {
            moderation: null,
        }
    },
    async mounted() {
        if (!this.$isGranted('users')) { return; }
        this.moderation = await this.$axios.$get(`/admin/moderation`);

        this.update();

        const observer = new MutationObserver(this.update);
        observer.observe(this.$refs.original, {
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
            if (!this.moderation) { return; }

            let html = this.$refs.original.innerHTML;
            for (let sus of this.moderation.susRegexes) {
                html = html.replace(new RegExp(sus, 'gi'), m => `<mark>${m}</mark>`);
            }
            this.$refs.marked.innerHTML = html;
        },
    },
};
</script>
