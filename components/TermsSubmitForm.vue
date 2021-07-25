<template>
    <section v-if="$user()">
        <div v-if="afterSubmit" class="alert alert-success text-center">
            <p>
                <T>nouns.submit.thanks</T>
            </p>
            <p>
                <button class="btn btn-success" @click="afterSubmit = false">
                    <Icon v="plus"/>
                    <T>nouns.submit.another</T>
                </button>
            </p>
        </div>
        <form v-else @submit.prevent="submit">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div class="form-group">
                        <label class="text-nowrap"><strong>
                            <T>nouns.terms.term</T>
                        </strong></label>
                        <NounForm v-model="form.term" required maxlength="128"/>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="form-group">
                        <label class="text-nowrap"><strong>
                            <T>nouns.terms.original</T>
                        </strong></label>
                        <NounForm v-model="form.original" maxlength="1024"/>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label class="text-nowrap"><strong>
                    <T>nouns.terms.definition</T>
                </strong></label>
                <textarea v-model="form.definition" class="form-control form-control-sm" required rows="6"></textarea>
            </div>

            <div class="form-group">
                <label class="text-nowrap"><strong>
                    <T>nouns.terms.category</T>
                </strong></label>
                <select v-model="form.category" class="form-control form-control-sm">
                    <option value=""></option>
                    <option v-for="category in config.nouns.terms.categories" :value="category">{{category}}</option>
                </select>
            </div>

            <div class="row" v-if="$isGranted('terms')">
                <div class="col-12 col-lg-6">
                    <div class="form-group">
                        <label class="text-nowrap"><strong>
                            <T>profile.flags</T>
                        </strong></label>
                        <ListInput v-model="form.flags" v-slot="s"/>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="form-group">
                        <label class="text-nowrap"><strong>
                            <T>nouns.terms.images</T>
                        </strong></label>
                        <ImageWidget v-model="form.images" multiple/>
                    </div>
                </div>
            </div>

            <div class="alert alert-info" v-if="form.base">
                <Icon v="info-circle"/>
                <T>nouns.editing</T>
                <button class="btn btn-sm float-end" @click="form.base = null">
                    <Icon v="times"/>
                </button>
            </div>

            <button class="btn btn-primary w-100" :disabled="submitting">
                <template v-if="submitting">
                    <Icon v="circle-notch fa-spin"/>
                </template>
                <template v-else>
                    <Icon v="plus"/>
                    <T>nouns.submit.actionLong</T>
                </template>
            </button>
            <p class="small text-muted mt-1"><T>nouns.submit.moderation</T></p>
        </form>
    </section>
    <section v-else class="text-center">
        <div class="alert alert-info">
            <T>crud.loginRequired</T>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    term: [''],
                    original: [],
                    definition: '',
                    category: '',
                    flags: [],
                    images: [],
                    base: null,
                },
                submitting: false,
                afterSubmit: false,
            }
        },
        methods: {
            async submit(event) {
                this.submitting = true;
                try {
                    await this.$post(`/terms/submit`, this.form);

                    this.afterSubmit = true;
                    this.form = {
                        term: [''],
                        original: [],
                        definition: '',
                        category: '',
                        flags: [],
                        images: [],
                        base: null,
                    };
                } finally {
                    this.submitting = false;
                }
            },
            edit(word) {
                this.form = {
                    term: word.term,
                    original: word.original,
                    definition: word.definition,
                    category: word.category,
                    flags: word.flags,
                    images: word.images,
                    base: word.id,
                }
                this.afterSubmit = false;
                this.$el.scrollIntoView();
            }
        },
    };
</script>
