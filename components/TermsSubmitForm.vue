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
                            <NounForm v-model="form.term" required/>
                        </td>
                        <td>
                            <NounForm v-model="form.original"/>
                        </td>
                        <td>
                            <textarea v-model="form.definition" class="form-control form-control-sm" required rows="3"></textarea>
                        </td>
                    </tr>
                    <tr v-if="$isGranted('terms')">
                        <td colspan="3">
                            <T>profile.flags</T>
                            <ListInput v-model="form.flags" v-slot="s"/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="alert alert-info" v-if="form.base">
                <Icon v="info-circle"/>
                <T>nouns.editing</T>
                <button class="btn btn-sm float-right" @click="form.base = null">
                    <Icon v="times"/>
                </button>
            </div>

            <button class="btn btn-primary btn-block" :disabled="submitting">
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
                    flags: [],
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
                    flags: [],
                    base: null,
                };
            },
            edit(word) {
                this.form = {
                    term: word.term,
                    original: word.original,
                    definition: word.definition,
                    flags: word.flags,
                    base: word.id,
                }
                this.afterSubmit = false;
                this.$el.scrollIntoView();
            }
        },
    };
</script>
