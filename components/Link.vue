<template>
    <li class="my-2">
        <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
        <span v-for="lang in link.lang || []" class="badge bg-light text-dark border">{{lang}}</span>
        <a :href="link.url" target="_blank" rel="noopener">
            <LinkedText :text="link.headline"/>
        </a>
        <LinkedText :text="link.extra || ''"/>
        <p v-if="link.quote" class="small pl-4">
            <T>quotation.start</T><LinkedText :text="link.quote"/><T>quotation.end</T>
        </p>
    </li>
</template>

<script>
    export default {
        props: {
            link: { required: true },
        }
    };
</script>
