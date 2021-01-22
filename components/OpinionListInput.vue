<template>
    <ListInput v-model="v" :prototype="{key: '', value: 0}" v-slot="s" :group="group">
        <button type="button" :class="['btn', parseInt(s.val.value) === 1 ? 'btn-primary' : 'btn-outline-secondary']"
                :aria-label="$t('profile.opinion.yes')"
                :title="$t('profile.opinion.yes')"
                @click="s.update({key: s.val.key, value: 1})">
            <Icon v="heart"/>
        </button>
        <button type="button" :class="['btn', parseInt(s.val.value) === 2 ? 'btn-primary' : 'btn-outline-secondary']"
                :aria-label="$t('profile.opinion.jokingly')"
                :title="$t('profile.opinion.jokingly')"
                @click="s.update({key: s.val.key, value: 2})">
            <Icon v="grin-tongue"/>
        </button>
        <button type="button" :class="['btn', parseInt(s.val.value) === 0 ? 'btn-primary' : 'btn-outline-secondary']"
                :aria-label="$t('profile.opinion.meh')"
                :title="$t('profile.opinion.meh')"
                @click="s.update({key: s.val.key, value: 0})">
            <Icon v="thumbs-up"/>
        </button>
        <button type="button" :class="['btn', parseInt(s.val.value) === -1 ? 'btn-primary' : 'btn-outline-secondary']"
                :aria-label="$t('profile.opinion.no')"
                :title="$t('profile.opinion.no')"
                @click="s.update({key: s.val.key, value: -1})">
            <Icon v="thumbs-down"/>
        </button>
        <input v-model="s.val.key" class="form-control mw-input" @keyup="s.update(s.val)" required/>
        <small v-if="validation && s.val.key && validation(s.val.key)" class="input-group-text bg-danger text-white">
            <Icon v="exclamation-triangle"/>
            <span class="ml-1">{{$t(validation(s.val.key))}}</span>
        </small>
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
        watch: { v() { this.$emit('input', this.v); } }
    }
</script>
