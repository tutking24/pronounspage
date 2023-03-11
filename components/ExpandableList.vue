<template>
    <ul>
        <li v-for="(el, i) in values" :class="itemClass" v-if="allShown || i < showLimit">
            <slot v-bind:el="el" v-bind:i="i">
                {{ el }}
            </slot>
        </li>
        <li v-if="!allShown && hiddenCount > 0" :class="[itemClass, 'small']">
            <span v-if="static">
                <Icon v="plus-circle"/>
                <T :params="{count: hiddenCount}">profile.expendableList.more</T>
            </span>
            <a v-else href="#" @click.prevent="allShown = true">
                <Icon v="plus-circle"/>
                <T :params="{count: hiddenCount}">profile.expendableList.more</T>
                <template v-if="!(itemClass || '').includes('list-inline-item')">
                    <br/>
                    <Icon v="spacer"/>
                </template>
                <T>profile.expendableList.show</T>
            </a>
        </li>
    </ul>
</template>

<script>
import {mapState} from "vuex";

export default {
    props: {
        values: { required: true },
        limit: { required: true },
        reducedLimit: { 'default': 4 },
        static: { type: Boolean },
        expand: { type: Boolean },
        itemClass: {},
    },
    data() {
        return this.calcData();
    },
    methods: {
        calcData() {
            let showLimit = this.values.length;
            let hiddenCount = 0;
            const limit = (this.reducedItems === undefined || this.reducedItems) ? this.reducedLimit : this.limit;

            if (this.values.length > limit) {
                showLimit = limit;
                hiddenCount = this.values.length - limit;
            }
            if (hiddenCount === 1) {
                showLimit--;
                hiddenCount++;
            }

            return {
                allShown: this.expand,
                showLimit,
                hiddenCount,
            }
        },
    },
    mounted() {
        // not sure why that's necessary, but screw it…

        if (!process.client) { return; }

        for (let [key, value] of Object.entries(this.calcData())) {
            this[key] = value;
        }
    },
    watch: {
        expand(v) {
            if (v) {
                this.allShown = true;
            }
        },
        reducedItems() {
            for (let [key, value] of Object.entries(this.calcData())) {
                this[key] = value;
            }
        }
    },
    computed: {
        ...mapState([
            'reducedItems',
        ]),
    }
}
</script>
