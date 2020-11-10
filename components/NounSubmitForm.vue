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
                <table :class="'table table-borderless table-sm table-fixed-' + (config.nouns.plurals ? '4' : '3')">
                    <thead>
                    <tr>
                        <th v-if="config.nouns.plurals"></th>
                        <th class="text-nowrap">
                            <Icon v="mars"/>
                            <span class="d-none d-md-inline"><T>nouns.masculine</T></span>
                            <span class="d-md-none"><T>nouns.masculineShort</T></span>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="venus"/>
                            <span class="d-none d-md-inline"><T>nouns.feminine</T></span>
                            <span class="d-md-none"><T>nouns.feminineShort</T></span>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="neuter"/>
                            <span class="d-none d-md-inline"><T>nouns.neuter</T></span>
                            <span class="d-md-none"><T>nouns.neuterShort</T></span>
                        </th>
                        <th v-if="$admin()"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th v-if="config.nouns.plurals" class="text-nowrap">
                            <span class="d-none d-md-inline">⋅ <T>nouns.singular</T></span>
                            <span class="d-md-none">⋅ <T>nouns.singularShort</T></span>
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
                    <tr v-if="config.nouns.plurals">
                        <th class="text-nowrap">
                            <span class="d-none d-md-inline">⁖ <T>nouns.plural</T></span>
                            <span class="d-md-none">⁖ <T>nouns.pluralShort</T></span>
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
                <T>nouns.editing</T>
                <button class="btn btn-sm float-right" @click="form.base = null">
                    <Icon v="times"/>
                </button>
            </div>

            <template v-if="config.nouns.templates">
                <a v-if="!templateVisible" href="#" @click.prevent="templateVisible = true" class="btn btn-outline-primary btn-block">
                    <Icon v="copy"/>
                    <T>nouns.template</T>
                </a>
                <div v-else class="card mb-3">
                    <a href="#" class="card-header" @click.prevent="templateVisible = false">
                        <Icon v="copy"/>
                        <T>nouns.template</T>
                    </a>
                    <div class="card-body">
                        <T>nouns.root</T>: <input class="form-control form-control-sm d-inline-block w-auto" v-model="templateBase" autofocus/>

                        <ul>
                            <li v-for="template in templates" class="my-2">
                                {{ template.toString() }}
                                <button type="button" class="btn btn-outline-primary btn-sm" @click="form = template.fill(templateBase)">
                                    <Icon v="copy"/>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>

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
    import { nounTemplates } from '../src/data';

    export default {
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
                await this.$axios.$post(`/nouns/submit`, this.form);

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
