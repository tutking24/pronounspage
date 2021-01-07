<template>
    <div class="form-group">
        <draggable tag="ul" v-model="images" handle="img" ghostClass="ghost" @end="$emit('input', images)" class="list-unstyled">
            <li v-for="image in images" class="mb-4">
                <ImageThumb :id="image"/>
                <a href="#" @click.prevent="removeFile(image)" class="small">
                    <Icon v="trash"/>
                    <T>crud.remove</T>
                </a>
            </li>
        </draggable>
        <ImageUploader :multiple="multiple" :name="name" @uploaded="addFiles"/>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable,
        },
        props: {
            value: {},
            multiple: {type: Boolean},
            name: {'default': 'images'},
        },
        data() {
            return {
                images: this.value,
            }
        },
        watch: {
            value() {
                this.images = this.value;
            }
        },
        methods: {
            addFiles(files) {
                this.$emit('input', [...this.images, ...files]);
            },
            async removeFile(id) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');
                this.$emit('input', this.images.filter(i => i !== id));
            },
        },
    }
</script>
