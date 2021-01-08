<template>
    <div
          :class="['uploader-container', form ? 'form-control p-2' : 'btn btn-outline-primary btn-sm', drag ? 'drag' : '']"
          @dragover="drag=true" @dragleave="drag=false"
    >
        <input type="file"
               :name="name + (multiple ? '[]' : '')"
               :multiple="multiple"
               :disabled="uploading"
               @change="filesChange($event.target.name, $event.target.files)"
               accept="image/*">
        <p v-if="errorMessage" class="text-danger mb-0">
            <Icon v="exclamation-circle"/>
            <T>{{errorMessage}}</T>
        </p>
        <p v-else-if="uploading" class="mb-0">
            <Spinner/>
        </p>
        <p v-else class="mb-0">
            <Icon v="upload"/>
            <T>images.upload.instruction{{small ? 'Short' : ''}}</T>
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            multiple: {type: Boolean},
            name: {'default': 'images'},
            form: {type: Boolean},
            small: {type: Boolean}
        },
        data() {
            return {
                uploading: false,
                drag: false,
                errorMessage: '',
            }
        },
        methods: {
            async filesChange(fieldName, fileList) {
                if (!fileList.length) {
                    return;
                }
                this.drag = false;
                const formData = new FormData();
                for (let file of fileList) {
                    formData.append(fieldName, file, file.name);
                }
                await this.save(formData);
            },
            async save(formData) {
                this.uploading = true;
                this.errorMessage = '';
                try {
                    const ids = await this.$axios.$post('/images/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    this.$emit('uploaded', ids);
                } catch {
                    this.errorMessage = 'error.generic';
                }
                this.uploading = false;
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../assets/style";

    .uploader-container {
        position: relative;
        cursor: pointer;
        &.form-control {
            &:hover, &.drag {
                background: lighten($primary, 50%);
            }
        }
    }

    input[type="file"] {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
</style>
