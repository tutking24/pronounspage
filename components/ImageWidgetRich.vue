<template>
    <div class="form-group">
        <draggable tag="ul" v-model="images" handle=".handle" ghostClass="ghost" @end="$emit('input', images)" class="list-unstyled">
            <li v-for="(image, i) in images" class="mb-4">
                <div class="input-group mb-1">
                    <button class="btn btn-light border handle" type="button" :aria-label="$t('table.sort')">
                        <Icon v="bars"/>
                    </button>
                    <ImageThumb :id="image.id" smallSize="flag" bigSize="flag" size="2.4em"/>
                    <input v-model="images[i].desc" type="text" class="form-control"
                           @keyup="update" @change="update"
                           required :maxlength="maxLength"/>
                    <button class="btn btn-outline-danger" type="button" @click.prevent="removeFile(image.id)" :aria-label="$t('crud.remove')">
                        <Icon v="times"/>
                    </button>
                </div>
            </li>
            <li slot="footer">
                <ImageUploader multiple :name="name" form @uploaded="addFiles"/>
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
            value: {type: Object},
            name: {'default': 'images'},
            maxLength: {'default': 24},
        },
        data() {
            return {
                images: this.dictToList(this.value),
                curry,
            }
        },
        watch: {
            value() {
                this.images = this.dictToList(this.value);
            }
        },
        methods: {
            addFiles(files) {
                this.$emit('input', this.listToDict([...this.images, ...files]));
            },
            async removeFile(id) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');
                this.$emit('input', this.listToDict(this.images.filter(i => i.id !== id)));
            },
            update() {
                this.$emit('input', this.listToDict(this.images));
            },

            dictToList(dict) {
                const images = [];
                for (let id in dict) {
                    if (dict.hasOwnProperty(id)) {
                        images.push({id, desc: dict[id]});
                    }
                }
                return images;
            },
            listToDict(list) {
                const images = {};
                for (let image of list) {
                    if (typeof(image) === 'string') {
                        image = {id: image, desc: ''};
                    }
                    images[image.id] = image.desc;
                }
                return images;
            },
        },
    }
</script>
