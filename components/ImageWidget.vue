<template>
    <div class="form-group">
        <ul class="list-unstyled">
            <li v-for="image in images" class="mb-4">
                <ImageThumb :id="image"/>
                <a href="#" @click.prevent="removeFile(image)" class="small">
                    <Icon v="trash"/>
                    <T>crud.remove</T>
                </a>
            </li>
        </ul>
        <ImageUploader :multiple="multiple" :name="name" @uploaded="addFiles"/>
    </div>
</template>

<script>
    export default {
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
