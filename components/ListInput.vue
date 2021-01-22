<template>
    <draggable tag="ul" v-model="iVal" handle=".handle" ghostClass="ghost" @end="$emit('input', iVal)" class="list-unstyled" :group="group">
        <li v-for="(v, i) in iVal" ref="items">
            <div class="input-group input-group-sm mb-1">
                <button class="btn btn-light border handle" type="button" :aria-label="$t('table.sort')">
                    <Icon v="bars"/>
                </button>
                <slot v-bind:val="iVal[i]" v-bind:update="curry(update)(i)">
                    <input v-model="iVal[i]" type="text" class="form-control" required/>
                </slot>
                <button class="btn btn-outline-danger" type="button" @click.prevent="remove(i)" :aria-label="$t('crud.remove')">
                    <Icon v="times"/>
                </button>
            </div>
        </li>

        <li slot="footer">
            <button class="btn btn-outline-success w-100 btn-sm" type="button" @click.prevent="add" :aria-label="$t('crud.add')">
                <Icon v="plus"/>
            </button>
        </li>
    </draggable>
</template>

<script>
    import { curry } from "../src/helpers";
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable,
        },
        props: {
            value: {},
            prototype: { 'default': '' },
            group: {},
        },
        data() {
            return {
                iVal: this.value,
                curry: curry,
            }
        },
        watch: {
            value() {
                this.iVal = this.value;
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
                    this.$refs.items[this.value.length - 1].querySelector('input,textarea,select').focus();
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

<style lang="scss" scoped>
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }
</style>
