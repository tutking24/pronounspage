<template>
    <div
          :class="['uploader-container', 'p-2', 'form-control', drag ? 'drag' : '']"
          @dragover="drag=true" @dragleave="drag=false"
    >
        <input type="file"
               :name="name + (multiple ? '[]' : '')"
               :multiple="multiple"
               :disabled="uploading"
               @change="filesChange($event.target.name, $event.target.files)"
               accept="image/*">
        <p v-if="errorMessage" class="text-danger">
            <Icon v="exclamation-circle"/>
            <T>{{errorMessage}}</T>
        </p>
        <p v-else-if="uploading">
            <Spinner/>
        </p>
        <p v-else>
            <Icon v="upload"/>
            <T>images.upload.instruction</T>
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            multiple: {type: Boolean},
            name: {'default': 'images'},
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
        &:hover, &.drag {
            background: lighten($primary, 50%);
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
