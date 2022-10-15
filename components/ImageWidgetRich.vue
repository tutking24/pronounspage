<template>
    <div class="form-group">
        <draggable tag="ul" v-model="images" handle=".handle" ghostClass="ghost" @end="$emit('input', images)" class="list-unstyled">
            <li v-for="(image, i) in images" class="mb-4">
                <div class="input-group mb-1">
                    <button class="btn btn-light border handle" type="button" :aria-label="$t('table.sort')">
                        <Icon v="bars"/>
                    </button>
                    <ImageThumb :id="images[i].value" smallSize="flag" bigSize="flag" size="2.4em"/>
                    <input v-model="images[i].name" type="text" class="form-control"
                           @keyup="update" @change="update"
                           required :maxlength="maxLength"/>
                    <button class="btn btn-outline-danger" type="button" @click.prevent="removeFile(image.value)" :aria-label="$t('crud.remove')">
                        <Icon v="times"/>
                    </button>
                </div>
            </li>
            <li slot="footer">
                <ImageUploader v-if="maxitems === null || value.length < maxitems" multiple :name="name" form @uploaded="addFiles" :sizes="sizes"/>
            </li>
            <li v-if="maxitems && value.length > maxitems" class="alert alert-danger">
                <Icon v="exclamation-triangle"/>
                <T :params="{maxlength: maxitems}" class="ml-1">crud.validation.listMaxLength</T>
            </li>
        </draggable>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import { curry } from "../src/helpers";

    export default {
        components: {
            draggable,
        },
        props: {
            value: {},
            name: {'default': 'images'},
            maxLength: {'default': 24},
            sizes: {'default': 'all'},
            maxitems: { 'default': null },
        },
        data() {
            return {
                images: this.value,
                curry,
            }
        },
        watch: {
            value() {
                this.images = this.value;
            }
        },
        methods: {
            addFiles(fileIds) {
                this.$emit('input', [...this.images, ...fileIds.map(id => { return {value: id, name: ''}})]);
            },
            async removeFile(id) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');
                this.$emit('input', this.images.filter(i => i.value !== id));
            },
            update() {
                this.$emit('input', this.images);
            },
        },
    }
</script>
