<template>
    <a :href="base + '/' + pronounWithoutDomain" class="badge bg-primary text-white mx-1">
        {{ pronounName || pronounCleared }}
    </a>
</template>

<script>
export default {
    props: {
        pronoun: { required: true },
        locale: { required: true },
    },
    data() {
        return {
            pronounName: undefined,
        }
    },
    async mounted() {
        try {
            this.pronounName = await this.$axios.$get(`/remote-pronouns-name/${this.locale}/${this.pronounWithoutDomain}`);
        } catch {}
    },
    computed: {
        base() {
            return this.locales[this.locale].url;
        },
        pronounWithoutDomain() {
            return this.pronoun.startsWith(this.base + '/')
                ? this.pronoun.substring(this.base.length + 1)
                : this.pronoun;
        },
        pronounCleared() {
            return this.pronounWithoutDomain.split(',')[0].substring(0, 24);
        },
    },
}
</script>
