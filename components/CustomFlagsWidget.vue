<template>
    <div class="form-group">
        <draggable tag="ul" v-model="images" handle=".handle" ghostClass="ghost" @end="$emit('input', images)" class="list-unstyled">
            <li v-for="(image, i) in images" class="mb-4">
                <div class="input-group mb-1">
                    <button class="btn btn-light border handle" type="button" :aria-label="$t('table.sort')">
                        <Icon v="bars"/>
                    </button>
                    <div class="d-flex flex-grow-1 flex-column">
                        <div class="d-flex">
                            <ImageThumb :id="images[i].value" smallSize="flag" bigSize="flag" size="2.4em"/>
                            <input v-model="images[i].name" type="text" class="form-control"
                                   @keyup="update" @change="update"
                                   :placeholder="$t('profile.flagsCustomForm.label')"
                                   required :maxlength="maxLength"/>
                        </div>
                        <div>
                            <input v-model="images[i].description" type="text" class="form-control form-control-sm"
                                   @keyup="update" @change="update"
                                   :placeholder="$t('profile.flagsCustomForm.description')"
                                   maxlength="512"
                            />
                        </div>
                        <div>
                            <input v-model="images[i].alt" type="text" class="form-control form-control-sm"
                                   @keyup="update" @change="update"
                                   :placeholder="$t('profile.flagsCustomForm.alt')"
                                   maxlength="512"
                            />
                        </div>
                        <div>
                            <input v-model="images[i].link" type="url" class="form-control form-control-sm"
                                   @keyup="update" @change="update"
                                   :placeholder="$t('profile.flagsCustomForm.link')"
                            />
                            <p v-if="images[i].link && !isValidLink(images[i].link)" class="small text-danger m-1">
                                <Icon v="exclamation-triangle"/>
                                <span class="ml-1">{{$t('crud.validation.invalidLink')}}</span>
                            </p>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger" type="button" @click.prevent="removeFile(image.value)" :aria-label="$t('crud.remove')">
                        <Icon v="times"/>
                    </button>
                </div>
            </li>
            <li slot="footer">
                <ImageUploader v-if="maxitems === null || value.length < maxitems" multiple :name="name" form @uploaded="addFiles" :sizes="sizes"/>
                <div v-if="images.length" class="alert alert-info small mt-3 mb-0">
                    <p>
                        <Icon v="info-circle"/>
                        <T>profile.flagsCustomForm.altExample</T><T>quotation.colon</T>
                    </p>
                    <p class="simple">
                        <Flag img="/flags/Progress Pride_.png" name="" :alt="$t('flags_alt.Progress_Pride_')"/>
                        <T>flags_alt.Progress_Pride_</T>
                    </p>
                </div>
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
    import {curry, isValidLink} from "../src/helpers";

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
                isValidLink,
            }
        },
        watch: {
            value() {
                this.images = this.value;
            }
        },
        methods: {
            addFiles(fileIds) {
                this.$emit('input', [...this.images, ...fileIds.map(id => { return {value: id, name: '', description: '', link: '', alt: ''}})]);
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
