<template>
    <ListInput v-model="v" :prototype="{key: '', value: 0}" v-slot="s">
        <div class="input-group-prepend">
            <button type="button" :class="['btn', parseInt(s.val.value) === 1 ? 'btn-primary' : 'btn-outline-secondary']"
                    @click="s.update({key: s.val.key, value: 1})">
                <Icon v="heart"/>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === 0 ? 'btn-primary' : 'btn-outline-secondary']"
                    @click="s.update({key: s.val.key, value: 0})">
                <Icon v="thumbs-up"/>
            </button>
            <button type="button" :class="['btn', parseInt(s.val.value) === -1 ? 'btn-primary' : 'btn-outline-secondary']"
                    @click="s.update({key: s.val.key, value: -1})">
                <Icon v="thumbs-down"/>
            </button>
        </div>
        <input v-model="s.val.key" class="form-control" @keyup="s.update(s.val)" required/>
    </ListInput>
</template>

<script>
    export default {
        props: { value: {} },
        data() { return { v: this.value } },
        watch: { v() { this.$emit('input', this.v); } }
    }
</script>
