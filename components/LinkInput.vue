<template>
    <div class="input-group my-2">
        <input class="form-control" readonly :value="link.replace('https://', '').replace('http://', '')" id="link" ref="link">
        <button class="btn btn-outline-secondary" ref="clipboard" data-clipboard-target="#link" :data-clipboard-text="link" @click="focusLink" :aria-label="$t('crud.copy')" :title="$t('crud.copy')">
            <Icon v="clipboard"/>
        </button>
        <a :href="link" target="_blank" rel="noopener" class="btn btn-outline-secondary">
            <Icon v="external-link"/>
        </a>
    </div>
</template>

<script>
    import ClipboardJS from 'clipboard';

    export default {
        props: {
            link: { required: true },
        },
        mounted () {
            new ClipboardJS(this.$refs.clipboard);
        },
        methods: {
            focusLink() {
                setTimeout(_ => this.$refs.link.select(), 100);
            },
        },
    }
</script>
