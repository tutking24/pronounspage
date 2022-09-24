<template>
    <ListInput v-model="v" :prototype="{value: '', opinion: 'meh'}" :group="group">
        <template v-slot="s">
            <button type="button" :class="['btn', s.val.opinion === 'yes' ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.yes')"
                    @click="s.update({...s.val, value: s.val.value, opinion: 'yes'})">
                <Tooltip :text="$t('profile.opinion.yes')">
                    <Icon v="heart"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', s.val.opinion === 'jokingly' ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.jokingly')"
                    @click="s.update({...s.val, value: s.val.value, opinion: 'jokingly'})">
                <Tooltip :text="$t('profile.opinion.jokingly')">
                    <Icon v="grin-tongue"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', s.val.opinion === 'close' ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.close')"
                    @click="s.update({...s.val, value: s.val.value, opinion: 'close'})">
                <Tooltip :text="$t('profile.opinion.close')">
                    <Icon v="user-friends"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', s.val.opinion === 'meh' ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.meh')"
                    @click="s.update({...s.val, value: s.val.value, opinion: 'meh'})">
                <Tooltip :text="$t('profile.opinion.meh')">
                    <Icon v="thumbs-up"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', s.val.opinion === 'no' ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.no')"
                    @click="s.update({...s.val, value: s.val.value, opinion: 'no'})">
                <Tooltip :text="$t('profile.opinion.no')">
                    <Icon v="thumbs-down"/>
                </Tooltip>
            </button>
            <input v-model="s.val.value" :class="['form-control', 'mw-input', invalid(s.val) ? 'border-danger' : '']" @keyup="s.update(s.val)" required/>
        </template>
        <template v-slot:validation="s">
            <p v-if="invalid(s.val)" class="small text-danger">
                <Icon v="exclamation-triangle"/>
                <span class="ml-1">{{$t(validation(s.val.value))}}</span>
            </p>
        </template>
    </ListInput>
</template>

<script>
    export default {
        props: {
            value: {},
            group: {},
            validation: {},
        },
        data() {
            return {
                v: this.value,
            }
        },
        watch: {
            v() { this.$emit('input', this.v); },
            value(v) { this.v = v; }
        },
        methods: {
            invalid(val) {
                return this.validation && val.value && this.validation(val.value);
            },
        },
    }
</script>

<style lang="scss">
    @import "assets/variables";

    @include media-breakpoint-down('sm', $grid-breakpoints) {
        .btn-thin {
            padding-left: map-get($spacers, 1) !important;
            padding-right: map-get($spacers, 1) !important;
        }
    }
</style>
