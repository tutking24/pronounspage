<template>
    <div class="card">
        <div class="card-header">
            <Icon v="plus-circle"/>
            <T>sources.submit.header</T>
        </div>
        <div class="card-body">
            <div v-if="afterSubmit" class="alert alert-success text-center">
                <p>
                    <T>sources.submit.thanks</T>
                </p>
                <p>
                    <button class="btn btn-success" @click="afterSubmit = false">
                        <Icon v="plus"/>
                        <T>sources.submit.another</T>
                    </button>
                </p>
            </div>
            <form v-else @submit.prevent="submit">
                <div class="form-group">
                    <label for="type" class="required"><T>sources.submit.type</T></label>
                    <select id="type" class="form-control" v-model="form.type" required>
                        <option value=""></option>
                        <option v-for="t in ['Book', 'Article', 'Movie', 'Series', 'Song', 'Poetry', 'Other']" :value="t">
                            <T>sources.type.{{t}}</T>
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="author"><T>sources.submit.author</T></label>
                    <input type="text" id="author" class="form-control" v-model="form.author"
                           maxlength="255"/>
                </div>
                <div class="form-group">
                    <label for="title" class="required"><T>sources.submit.title</T></label>
                    <input type="text" id="title" class="form-control" v-model="form.title"
                           required maxlength="255"/>
                </div>
                <div class="form-group">
                    <label for="extra"><T>sources.submit.extra</T></label>
                    <input type="text" id="extra" class="form-control" v-model="form.extra"
                           maxlength="255"/>
                </div>
                <div class="form-group">
                    <label for="year"><T>sources.submit.year</T></label>
                    <input type="number" id="year" class="form-control" v-model="form.year"
                           min="0" max="2100"/>
                </div>
                <div class="form-group">
                    <label for="fragments"><T>sources.submit.fragments</T></label>
                    <ListInput v-model="form.fragments" v-slot="s" id="fragments">
                        <textarea v-model="s.val" class="form-control" rows="3" @keyup="s.update(s.val)" required></textarea>
                    </ListInput>
                </div>
                <div class="form-group">
                    <label for="pronouns" class="required"><T>sources.submit.pronouns</T></label>
                    <p class="small text-muted mb-0">
                        <T>sources.submit.pronounsInfo</T>
                    </p>
                    <ListInput v-model="form.pronouns" v-slot="s">
                        <input v-model="s.val" type="text" class="form-control" @keyup="s.update(s.val)" required maxlength="24"/>
                        <div v-if="s.val && !pronounLibrary.isCanonical(s.val)" class="input-group-append">
                            <small class="input-group-text bg-danger text-white">
                                <Icon v="exclamation-triangle"/>
                                <span class="ml-1"><T>profile.pronounsNotFound</T></span>
                            </small>
                        </div>
                    </ListInput>
                </div>
                <div class="form-group">
                    <label for="comment"><T>sources.submit.comment</T></label>
                    <input type="text" id="comment" class="form-control" v-model="form.comment"
                           maxlength="255"/>
                </div>
                <div class="form-group">
                    <label for="link"><T>sources.submit.link</T></label>
                    <input type="url" id="link" class="form-control" v-model="form.link"
                           maxlength="255"/>
                </div>
                <div class="alert alert-info" v-if="form.base">
                    <Icon v="info-circle"/>
                    <T>nouns.editing</T>
                    <button class="btn btn-sm float-right" @click="form.base = null">
                        <Icon v="times"/>
                    </button>
                </div>
                <button class="btn btn-success btn-block" :disabled="submitting">
                    <Icon v="plus-circle"/>
                    <T>sources.submit.action</T>
                </button>
                <p class="small text-muted mt-1"><T>sources.submit.moderation</T></p>
            </form>
        </div>
    </div>
</template>

<script>
    import {pronounLibrary} from "../src/data";

    export default {
        data() {
            return {
                form: {
                    pronouns: [''],
                    type: '',
                    author: '',
                    title: '',
                    extra: '',
                    year: '',
                    fragments: [],
                    comment: '',
                    link: '',
                    base: null,
                },

                submitting: false,
                afterSubmit: false,

                pronounLibrary,
            }
        },
        methods: {
            async submit() {
                this.submitting = true;
                await this.$axios.$post(`/sources/submit`, this.form);

                this.submitting = false;
                this.afterSubmit = true;
                this.form = {
                    pronouns: [''],
                    type: '',
                    author: '',
                    title: '',
                    extra: '',
                    year: '',
                    fragments: [],
                    comment: '',
                    link: '',
                    base: null,
                }
            },
            edit(source) {
                this.form = {
                    pronouns: source.pronouns,
                    type: source.type,
                    author: source.author,
                    title: source.title,
                    extra: source.extra,
                    year: source.year,
                    fragments: source.fragments,
                    comment: source.comment,
                    link: source.link,
                    base: source.id,
                }
                this.afterSubmit = false;
                this.$el.scrollIntoView();
            },
        },
    }
</script>
