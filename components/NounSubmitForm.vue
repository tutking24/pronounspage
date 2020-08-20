<template>
    <section>
        <div v-if="afterSubmit" class="alert alert-success text-center">
            <p>
                Dziękujemy za zgłoszenie!
            </p>
            <p>
                <button class="btn btn-success" @click="afterSubmit = false">
                    <Icon v="plus"/>
                    Zgłoś kolejne słowo
                </button>
            </p>
        </div>
        <form v-else @submit.prevent="submit">
            <div class="table-responsive">
                <table class="table table-borderless table-sm table-fixed-4">
                    <thead>
                    <tr>
                        <th></th>
                        <th class="text-nowrap">
                            <Icon v="mars"/>
                            <span class="d-none d-md-inline">maskulatyw</span>
                            <span class="d-md-none">mask.</span>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="venus"/>
                            <span class="d-none d-md-inline">feminatyw</span>
                            <span class="d-md-none">fem.</span>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="neuter"/>
                            <span class="d-none d-md-inline">neutratyw</span>
                            <span class="d-md-none">neutr.</span>
                        </th>
                        <th v-if="secret"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th class="text-nowrap">
                            <span class="d-none d-md-inline">⋅ liczba pojedyncza</span>
                            <span class="d-md-none">⋅ l. poj.</span>
                        </th>
                        <td>
                            <NounForm v-model="form.masc"/>
                        </td>
                        <td>
                            <NounForm v-model="form.fem"/>
                        </td>
                        <td>
                            <NounForm v-model="form.neutr"/>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-nowrap">
                            <span class="d-none d-md-inline">⁖ liczba mnoga</span>
                            <span class="d-md-none">⁖ l. mn.</span>
                        </th>
                        <td>
                            <NounForm v-model="form.mascPl"/>
                        </td>
                        <td>
                            <NounForm v-model="form.femPl"/>
                        </td>
                        <td>
                            <NounForm v-model="form.neutrPl"/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="alert alert-info" v-if="form.base">
                <Icon v="info-circle"/>
                Edytujesz istniejący wpis
                <button class="btn btn-sm float-right" @click="form.base = null">
                    <Icon v="times"/>
                </button>
            </div>

            <a v-if="!templateVisible" href="#" @click.prevent="templateVisible = true" class="btn btn-outline-nouns btn-block">
                <Icon v="copy"/>
                Użyj szablonu
            </a>
            <div v-else class="card mb-3">
                <a href="#" class="card-header" @click.prevent="templateVisible = false">
                    <Icon v="copy"/>
                    Użyj szablonu
                </a>
                <div class="card-body">
                    Rdzeń rzeczownika: <input class="form-control form-control-sm d-inline-block w-auto" v-model="templateBase" autofocus/>

                    <ul>
                        <li v-for="template in templates" class="my-2">
                            {{ template.toString() }}
                            <button type="button" class="btn btn-outline-nouns btn-sm" @click="form = template.fill(templateBase)">
                                <Icon v="copy"/>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <button class="btn btn-nouns btn-block" :disabled="submitting">
                <template v-if="submitting">
                    <Icon v="circle-notch fa-spin"/>
                </template>
                <template v-else>
                    <Icon v="plus"/>
                    Zgłoś propozycję
                </template>
            </button>
            <p class="small text-muted mt-1">Propozycje będą musiały zostać zatwierdzone przed opublikowaniem.</p>
        </form>
    </section>
</template>

<script>
    import { nounTemplates } from '../src/data';

    export default {
        props: {
            secret: {},
        },
        data() {
            return {
                form: {
                    masc: [''],
                    fem: [''],
                    neutr: [''],
                    mascPl: [''],
                    femPl: [''],
                    neutrPl: [''],
                    base: null,
                },
                submitting: false,
                afterSubmit: false,
                templates: nounTemplates,
                templateBase: '',
                templateVisible: false,
            }
        },
        methods: {
            async submit(event) {
                this.submitting = true;
                await this.$axios.$post(`/nouns/submit?secret=${this.secret}`, {
                    data: this.form,
                });

                this.submitting = false;
                this.afterSubmit = true;
                this.form = {
                    masc: [''],
                    fem: [''],
                    neutr: [''],
                    mascPl: [''],
                    femPl: [''],
                    neutrPl: [''],
                    base: null,
                };
                this.templateVisible = false;
                this.templateBase = '';
            },
            edit(word) {
                this.form = {
                    masc: word.masc,
                    fem: word.fem,
                    neutr: word.neutr,
                    mascPl: word.mascPl,
                    femPl: word.femPl,
                    neutrPl: word.neutrPl,
                    base: word.id,
                }
                this.$el.scrollIntoView();
            }
        },
    };
</script>
