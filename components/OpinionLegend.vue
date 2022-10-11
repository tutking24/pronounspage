<template>
    <div>
        <ul class="list-inline small text-muted text-center mx-4">
            <li v-for="(opinion, key) in opinions" class="list-inline-item">
                <Icon :v="opinion.icon"/>
                =
                <T>profile.opinion.{{key}}</T>
            </li>
        </ul>
        <ul v-if="Object.keys(custom).length > 0" class="list-inline small text-muted text-center mx-4">
            <li class="list-inline-item">
                <T>profile.opinions.custom</T>
            </li>
            <li v-for="(opinion, key) in custom" class="list-inline-item">
                <Icon :v="opinion.icon"/>
                =
                {{opinion.description}}
            </li>
        </ul>
    </div>
</template>

<script>
import opinions from '../src/opinions';

export default {
    props: {
        custom: { 'default': () => { return {} }},
    },
    data() {
        return {
            opinions: opinions,
        }
    },
}
</script>
