<template>
    <div>
        <p v-for="(p, i) in term.definition.split('\n\n')">
            <template v-if="i === 0">
                <span v-if="term.key && $isGranted('terms')" class="badge bg-primary text-white">
                    <T>sources.submit.key</T>:
                    {{term.key}}
                </span>
                <strong><LinkedTextMultiple :texts="term.term" noicons/></strong>
                <span v-if="term.original.length">(<LinkedTextMultiple :texts="term.original" glue="; " noicons/>)</span>
                –
            </template>
            <LinkedText :text="p" noicons/>
        </p>

        <ul class="list-inline">
            <li v-for="category in term.categories" class="list-inline-item">
                <a v-if="categoryLink" :href="`#:${category}`" class="badge bg-primary text-white" @click.prevent="filter = ':' + category">
                    {{category}}
                </a>
                <span v-else="" class="badge bg-primary text-white">
                    {{category}}
                </span>
            </li>
        </ul>

        <p v-if="flags && (term.flags.length || term.images.length)" class="text-center">
            <img v-for="flag in term.flags" :src="`/flags/${flag}.png`" class="flag m-1"/>
            <img v-for="image in term.images" :src="buildImageUrl(image, 'big')" class="flag m-1"/>
        </p>

        <div v-if="versions && term.versions.length" class="my-3 mx-2">
            <p>
                <button :class="['btn', versionsShown ? 'btn-primary' : 'btn-outline-primary', 'btn-sm']" @click="versionsShown = !versionsShown">
                    <Icon v="language"/>
                    <T>sources.otherVersions</T>
                    <Icon :v="versionsShown ? 'caret-up' : 'caret-down'"/>
                </button>
            </p>
            <ul v-if="versionsShown">
                <li v-for="version in term.versions" v-if="locales[version.locale] !== undefined">
                    <h4 class="h6 mb-2">
                        <strong>
                            <a :href="`${locales[version.locale].url}`" target="_blank" rel="noopener">{{locales[version.locale].name}}</a>:
                        </strong>
                    </h4>
                    <Term :term="version"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            term: { required: true },
            categoryLink: { type: Boolean },
            flags: { type: Boolean },
            versions: { type: Boolean },
        },
        data() {
            return {
                versionsShown: false,
            }
        }
    }
</script>
