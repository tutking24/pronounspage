<template>
    <div class="input-group my-2">
        <input class="form-control" readonly :value="link.replace('https://', '').replace('http://', '')" id="link" ref="link">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary btn-clipboard" data-clipboard-target="#link" :data-clipboard-text="link" @click="focusLink">
                <Icon v="clipboard"/>
            </button>
            <a :href="link" target="_blank" rel="noopener" class="btn btn-outline-secondary">
                <Icon v="external-link"/>
            </a>
        </div>
    </div>
</template>

<script>
    import ClipboardJS from 'clipboard';

    export default {
        props: {
            link: { required: true },
        },
        mounted () {
            new ClipboardJS('.btn-clipboard');
        },
        methods: {
            focusLink() {
                setTimeout(_ => this.$refs.link.select(), 100);
            },
        },
    }
</script>
