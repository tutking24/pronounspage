<template>
    <div>
        <draggable tag="ul" v-model="iVal" ghostClass="ghost" @end="$emit('input', iVal)" :group="ulid"
                   class="list-inline border rounded drop-empty px-3 py-2">
            <li v-for="val in iVal" class="list-inline-item py-1">
                <a href="#" class="badge badge-light border p-2" @click.prevent="$emit('input', iVal.filter(v => v !== val))">
                    <slot v-bind:v="val" v-bind:desc="options[val]">
                        {{ val }}
                    </slot>
                    <span class="text-danger">
                        <Icon v="times"/>
                    </span>
                </a>
            </li>
        </draggable>
        <div class="input-group py-1">
            <input v-model="search" class="form-control form-control-sm" :placeholder="$t('crud.search')"/>
            <div class="input-group-append">
                <button v-if="search" type="button" class="btn btn-light btn-sm border text-danger" @click.prevent="search = ''">
                    <Icon v="times"/>
                </button>

                <button v-if="all" type="button" class="btn btn-light btn-sm border" @click.prevent="all = false">
                    <Icon v="caret-up"/>
                </button>
                <button v-else type="button" class="btn btn-light btn-sm border" @click.prevent="all = true">
                    <Icon v="caret-down"/>
                </button>
            </div>
        </div>

        <draggable tag="ul" v-model="remainingOptions" ghostClass="ghost" @end="$emit('input', iVal)" class="list-inline" :group="ulid">
            <li v-for="val in remainingOptions" v-if="all || (search && options[val].toLowerCase().includes(search))" class="list-inline-item py-1">
                <a href="#" class="badge badge-light p-2" @click.prevent="$emit('input', [...iVal, val])">
                    <slot v-bind:v="val" v-bind:desc="options[val]">
                        {{ val }}
                    </slot>
                    <span class="text-success">
                        <Icon v="plus"/>
                    </span>
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
                search: '',
                all: false,
            }
        },
        watch: {
            value() {
                this.iVal = this.value;
                this.remainingOptions = this.buildRemainingOptions();
                this.search = '';
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
