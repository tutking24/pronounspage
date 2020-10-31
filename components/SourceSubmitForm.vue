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
                    <label for="templates"><T>sources.submit.extra</T></label>
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
                    <label for="templates" class="required"><T>sources.submit.templates</T></label>
                    <input type="text" id="templates" class="form-control" v-model="form.templates"
                           required maxlength="255"/>
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
    export default {
        data() {
            return {
                form: {
                    templates: '',
                    type: '',
                    author: '',
                    title: '',
                    extra: '',
                    year: '',
                    fragments: [],
                    comment: '',
                    link: '',
                },

                submitting: false,
                afterSubmit: false,
            }
        },
        methods: {
            async submit() {
                this.submitting = true;
                await this.$axios.$post(`/sources/submit/${this.config.locale}`, this.form, { headers: this.$auth() });

                this.submitting = false;
                this.afterSubmit = true;
                this.form = {
                    templates: '',
                    type: '',
                    author: '',
                    title: '',
                    extra: '',
                    year: '',
                    fragments: [],
                    comment: '',
                    link: '',
                }
            },
        },
    }
</script>
