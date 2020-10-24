<template>
    <ul class="list-unstyled">
        <li v-for="(v, i) in value" ref="items">
            <div class="input-group mb-1">
                <slot v-bind:val="value[i]" v-bind:update="curry(update)(i)">
                    <input v-model="value[i]" type="text" class="form-control" required/>
                </slot>
                <div class="input-group-append">
                    <button class="btn btn-outline-danger" type="button" @click.prevent="remove(i)">
                        <Icon v="times"/>
                    </button>
                </div>
            </div>
        </li>

        <li>
            <button class="btn btn-outline-success btn-block" type="button" @click.prevent="add">
                <Icon v="plus"/>
            </button>
        </li>
    </ul>
</template>

<script>
    import { curry } from "../src/helpers";

    export default {
        props: {
            value: {},
            prototype: { 'default': '' },
        },
        data() {
            return {
                curry: curry,
            }
        },
        methods: {
            remove(i) {
                const v = [...this.value];
                v.splice(i, 1);
                this.$emit('input', v);
            },
            add() {
                this.$emit('input', [...this.value, this.prototype]);
                this.$nextTick(_ => {
                    this.$refs.items[this.value.length - 1].querySelector('input').focus();
                });
            },
            update(i, val) {
                const v = [...this.value];
                v[i] = val;
                this.$emit('input', v);
            }
        },
    }
</script>
