<template>
    <ListInput v-model="v" :prototype="{key: '', value: 0}" v-slot="s" :group="group">
        <div class="input-group-prepend">
            <button type="button" :class="['btn', parseInt(s.val.value) === 1 ? 'btn-primary' : 'btn-outline-secondary']"
                    :aria-label="$t('profile.opinion.yes')"
                    @click="s.update({key: s.val.key, value: 1})">
                <Icon v="heart"/>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === 0 ? 'btn-primary' : 'btn-outline-secondary']"
                    :aria-label="$t('profile.opinion.meh')"
                    @click="s.update({key: s.val.key, value: 0})">
                <Icon v="thumbs-up"/>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === -1 ? 'btn-primary' : 'btn-outline-secondary']"
                    :aria-label="$t('profile.opinion.no')"
                    @click="s.update({key: s.val.key, value: -1})">
                <Icon v="thumbs-down"/>
            </button>
        </div>
        <input v-model="s.val.key" class="form-control mw-input" @keyup="s.update(s.val)" required/>
        <div v-if="validation && s.val.key" class="input-group-append">
            <span v-if="validation(s.val.key)" class="input-group-text bg-danger text-white">
                <small>
                    <Icon v="exclamation-triangle"/>
                    <span class="ml-1">{{$t(validation(s.val.key))}}</span>
                </small>
            </span>
        </div>
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
