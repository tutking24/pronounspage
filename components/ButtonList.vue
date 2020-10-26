<template>
    <div>
        <draggable tag="ul" v-model="iVal" ghostClass="ghost" @end="$emit('input', iVal)" :group="ulid"
                   class="list-inline border rounded drop-empty px-3 py-2">
            <li v-for="val in iVal" class="list-inline-item py-1">
                <a href="#" class="badge badge-light border p-2" @click.prevent>
                    <slot v-bind:v="val" v-bind:desc="options[val]">
                        {{ val }}
                    </slot>
                </a>
            </li>
        </draggable>

        <draggable tag="ul" v-model="remainingOptions" ghostClass="ghost" @end="$emit('input', iVal)" class="list-inline" :group="ulid">
            <li v-for="val in remainingOptions" class="list-inline-item py-1">
                <a href="#" class="badge badge-light p-2" @click.prevent>
                    <slot v-bind:v="val" v-bind:desc="options[val]">
                        {{ val }}
                    </slot>
                </a>
            </li>
        </draggable>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import { ulid } from 'ulid';

    export default {
        components: {
            draggable,
        },
        props: {
            value: {},
            options: {},
        },
        data() {
            return {
                iVal: this.value,
                remainingOptions: this.buildRemainingOptions(),
                ulid: ulid(),
            }
        },
        watch: {
            value() {
                this.iVal = this.value;
                this.remainingOptions = this.buildRemainingOptions();
            },
        },
        methods: {
            buildRemainingOptions() {
                return Object.keys(this.options).filter(o => !this.value.includes(o));
            },
        },
    }
</script>


<style lang="scss" scoped>
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .drop-empty:empty {
        min-height: 3em;
    }
</style>
