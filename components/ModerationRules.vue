<template>
    <details v-if="moderation" class="border mb-3">
        <summary :class="[emphasise ? 'bg-warning' : 'bg-light', 'p-3']">
            <h4 class="h5 d-inline">{{label}}</h4>
        </summary>
        <div class="border-top p-3">
            <div v-if="typeof(moderation[type]) === 'string'" v-html="moderation[type]"/>
            <ul v-else>
                <li v-for="k in moderation[type]"><code>{{k}}</code></li>
            </ul>
        </div>
    </details>
</template>

<script>
export default {
    props: {
        type: {required: true},
        label: {'default': 'Moderation rules'},
        emphasise: {type: Boolean},
    },
    data() {
        return {
            moderation: null,
        }
    },
    async mounted() {
        if (!this.$isGranted('users')) { return; }
        this.moderation = await this.$axios.$get(`/admin/moderation`);
    },
}
</script>
