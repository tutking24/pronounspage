<template>
    <div v-if="hasChanges" class="form-check form-switch my-2">
        <label>
            <input class="form-check-input" type="checkbox" v-model="propagate">
            <T>profile.editor.propagate</T>
        </label>
    </div>
</template>

<script>
    export default {
        props: {
            field: { required: true },
            before: { required: true },
            after: { required: true },
        },
        data() {
            return {
                propagate: false,
            }
        },
        computed: {
            hasChanges() {
                return JSON.stringify(this.before) !== JSON.stringify(this.after);
            }
        },
        methods: {
            emit() {
                this.$emit('change', this.field, this.hasChanges && this.propagate);
            },
        },
        watch: {
            hasChanges() { this.emit(); },
            propagate() { this.emit(); },
        }
    }
</script>
