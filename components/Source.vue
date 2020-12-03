<template>
    <div class="my-2">
        <Icon :v="source.icon()"/>
        <strong><template v-if="source.author">{{source.author.replace('^', '')}}</template><span v-if="source.author"> – </span><em><a v-if="source.link" :href="source.link" target="_blank" rel="noopener">{{source.title}}</a><span v-else>{{source.title}}</span></em></strong><template v-if="source.extra"> ({{source.extra}})</template>, {{source.year}}<template v-if="source.comment">; {{source.comment}}</template>
        <ul v-if="source.fragments.length">
            <li v-for="fragment in source.fragments">
                <T>quotation.start</T><span v-html="fragment.replace(/\n/g, '<br/>')"></span><T>quotation.end</T>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            source: { required: true },
        },
    }
</script>
