<template>
    <li class="my-2">
        <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
        <a :href="link.url" target="_blank" rel="noopener">
            <LinkedText :text="link.headline"/>
        </a>
        <LinkedText :text="link.extra || ''"/>
    </li>
</template>

<script>
    export default {
        props: {
            link: { required: true },
        }
    };
</script>
