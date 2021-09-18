<template>
    <ListInput v-model="v" :prototype="{key: '', value: 0}" :group="group">
        <template v-slot="s">
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
        watch: { v() { this.$emit('input', this.v); } },
        methods: {
            invalid(val) {
                return this.validation && val.key && this.validation(val.key)
            },
        },
    }
</script>
