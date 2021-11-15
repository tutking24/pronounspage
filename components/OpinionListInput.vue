<template>
    <ListInput v-model="v" :prototype="{key: '', value: 0}" :group="group">
        <template v-slot="s">
            <button type="button" :class="['btn', parseInt(s.val.value) === 1 ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.yes')"
                    @click="s.update({key: s.val.key, value: 1})">
                <Tooltip :text="$t('profile.opinion.yes')">
                    <Icon v="heart"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === 2 ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.jokingly')"
                    @click="s.update({key: s.val.key, value: 2})">
                <Tooltip :text="$t('profile.opinion.jokingly')">
                    <Icon v="grin-tongue"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === 3 ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.close')"
                    @click="s.update({key: s.val.key, value: 3})">
                <Tooltip :text="$t('profile.opinion.close')">
                    <Icon v="user-friends"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === 0 ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.meh')"
                    @click="s.update({key: s.val.key, value: 0})">
                <Tooltip :text="$t('profile.opinion.meh')">
                    <Icon v="thumbs-up"/>
                </Tooltip>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === -1 ? 'btn-primary' : 'btn-outline-secondary', 'btn-thin']"
                    :aria-label="$t('profile.opinion.no')"
                    @click="s.update({key: s.val.key, value: -1})">
                <Tooltip :text="$t('profile.opinion.no')">
                    <Icon v="thumbs-down"/>
                </Tooltip>
            </button>
            <input v-model="s.val.key" :class="['form-control', 'mw-input', invalid(s.val) ? 'border-danger' : '']" @keyup="s.update(s.val)" required/>
        </template>
        <template v-slot:validation="s">
            <p v-if="invalid(s.val)" class="small text-danger">
                <Icon v="exclamation-triangle"/>
                <span class="ml-1">{{$t(validation(s.val.key))}}</span>
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
        data() { return { v: this.value } },
        watch: {
            v() { this.$emit('input', this.v); },
            value(v) { this.v = v; }
        },
        methods: {
            invalid(val) {
                return this.validation && val.key && this.validation(val.key)
            },
        },
    }
</script>

<style lang="scss">
    @import "assets/style";

    @include media-breakpoint-down('sm', $grid-breakpoints) {
        .btn-thin {
            padding-left: map-get($spacers, 1) !important;
            padding-right: map-get($spacers, 1) !important;
        }
    }
</style>
