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
                            <Icon v="comment-times"/>
                            <T>nouns.inclusive.insteadOf</T>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="comment-check"/>
                            <T>nouns.inclusive.say</T>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="comment-dots"/>
                            <T>nouns.inclusive.because</T>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <NounForm v-model="form.insteadOf"/>
                        </td>
                        <td>
                            <NounForm v-model="form.say"/>
                        </td>
                        <td>
                            <textarea v-model="form.because" class="form-control form-control-sm" required rows="3"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="form-group">
                <label><strong><T>nouns.inclusive.categories</T>:</strong></label>
                <a v-for="category in config.nouns.inclusive.categories"
                   href="#" :class="['badge border mx-2', form.categories.includes(category) ? 'badge-primary' : 'badge-light']"
                   @click.prevent="form.categories = form.categories.includes(category) ? form.categories.filter(c => c !== category) : [...form.categories, category]"
                >
                    {{ category }}
                </a>
            </div>

            <div class="form-group">
                <label><strong><T>nouns.inclusive.sources</T>:</strong></label>
                <ListInput v-model="form.links" v-slot="s">
                    <input v-model="s.val" type="url" class="form-control" @keyup="s.update(s.val)" required/>
                </ListInput>
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
                    insteadOf: [''],
                    say: [''],
                    because: '',
                    categories: [],
                    links: [],
                    base: null,
                },
                submitting: false,
                afterSubmit: false,
            }
        },
        methods: {
            async submit(event) {
                this.submitting = true;
                await this.$axios.$post(`/inclusive/submit`, this.form);

                this.submitting = false;
                this.afterSubmit = true;
                this.form = {
                    insteadOf: [''],
                    say: [''],
                    because: '',
                    categories: [],
                    links: [],
                    base: null,
                };
            },
            edit(word) {
                this.form = {
                    insteadOf: word.insteadOf,
                    say: word.say,
                    because: word.because,
                    categories: word.categories,
                    links: word.links,
                    base: word.id,
                }
                this.afterSubmit = false;
                this.$el.scrollIntoView();
            }
        },
    };
</script>
