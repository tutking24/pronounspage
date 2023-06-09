<template>
    <draggable tag="ul" v-model="iVal" handle=".handle" ghostClass="ghost" @end="$emit('input', iVal)" @add="$emit('input', iVal)" class="list-unstyled" :group="group">
        <li v-for="(v, i) in iVal" ref="items">
            <div>
                <div class="input-group input-group-sm mb-1">
                    <button :class="['btn', 'btn-light border', readonly ? '' : 'handle']" type="button" :aria-label="$t('table.sort')" :disabled="readonly">
                        <Icon v="bars"/>
                    </button>
                    <slot v-bind:val="iVal[i]" v-bind:update="curry(update)(i)" v-bind:i="i">
                        <input v-model="iVal[i]" type="text" class="form-control" required :readonly="readonly" :maxlength="maxlength"/>
                    </slot>
                    <button :class="['btn', readonly ? 'btn-light border' : 'btn-outline-danger']" type="button" @click.prevent="remove(i)" :aria-label="$t('crud.remove')" :disabled="readonly">
                        <Icon v="times"/>
                    </button>
                </div>
                <slot name="validation" v-bind:val="iVal[i]" v-bind:i="i"></slot>
            </div>
        </li>

        <li slot="footer">
            <button  v-if="!readonly && (maxitems === null || iVal.length < maxitems)"
                     class="btn btn-outline-success w-100 btn-sm" type="button"
                     @click.prevent="add" :aria-label="$t('crud.add')">
                <Icon v="plus"/>
            </button>
        </li>
        <li v-if="maxitems && iVal.length > maxitems" class="alert alert-danger">
            <Icon v="exclamation-triangle"/>
            <T :params="{maxlength: maxitems}" class="ml-1">crud.validation.listMaxLength</T>
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
            readonly: { type: Boolean },
            maxlength: { 'default': 32 },
            maxitems: { 'default': null },
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
