<template>
    <ul class="list-unstyled">
        <li v-for="(value, key, i) in data" v-if="expanded || i < 10">
            <slot v-bind:k="key" v-bind:v="value">
                <strong>{{key}}</strong>: {{value}}
            </slot>
        </li>
        <li v-if="!expanded">
            <a href="#" @click.prevent="expanded = true">
                <T>table.more</T>
                <Icon v="caret-down"/>
            </a>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            data: { required: true },
            initial: { default: 10, },
        },
        data() {
            return {
                expanded: false,
            };
        }
    }
</script>
