<template>
    <section>
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
            <div class="table-responsive">
                <table class="table table-borderless table-sm table-fixed-3">
                    <thead>
                    <tr>
                        <th class="text-nowrap">
                            <T>nouns.terms.term</T>
                        </th>
                        <th class="text-nowrap">
                            <T>nouns.terms.original</T>
                        </th>
                        <th class="text-nowrap">
                            <T>nouns.terms.definition</T>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <NounForm v-model="form.term" required maxlength="128"/>
                        </td>
                        <td>
                            <NounForm v-model="form.original" maxlength="1024"/>
                        </td>
                        <td>
                            <textarea v-model="form.definition" class="form-control form-control-sm" required rows="3"></textarea>
                        </td>
                    </tr>
                    <tr v-if="$isGranted('terms')">
                        <td :colspan="$isGranted('terms') ? 1 : 3">
                            <T>nouns.terms.category</T>
                            <select v-model="form.category" class="form-control form-control-sm">
                                <option value=""></option>
                                <option v-for="category in config.nouns.terms.categories" :value="category">{{category}}</option>
                            </select>
                        </td>
                        <td v-if="$isGranted('terms')">
                            <T>profile.flags</T>
                            <ListInput v-model="form.flags" v-slot="s"/>
                        </td>
                        <td v-if="$isGranted('terms')">
                            <T>nouns.terms.images</T>
                            <ImageWidget v-model="form.images" multiple/>
                        </td>
                    </tr>
                    </tbody>
                </table>
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
                await this.$axios.$post(`/terms/submit`, this.form);

                this.submitting = false;
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
