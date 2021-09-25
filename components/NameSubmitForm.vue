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
                        <label><strong><T>names.name</T>:</strong></label>
                        <input v-model="form.name" class="form-control" required/>
                    </div>

                    <div class="form-group">
                        <label><strong><T>names.origin</T>:</strong></label>
                        <input v-model="form.origin" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label><strong><T>names.meaning</T>:</strong></label>
                        <input v-model="form.meaning" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label><strong><T>names.usage</T>:</strong></label>
                        <input v-model="form.usage" class="form-control"/>
                    </div>

                    <div class="form-group" v-if="config.names.legally">
                        <label><strong><T>names.legally</T>:</strong></label>
                        <input v-model="form.legally" class="form-control"/>
                    </div>

                    <template v-if="config.names.namedays">
                    <div class="form-group">
                        <label><strong><T>names.namedays</T>:</strong></label>
                        <ListInput v-model="form.namedays" v-slot="s">
                            <DayMonth v-model="s.val" @input="s.update(s.val)"/>
                        </ListInput>

                        <Debug :v="form.namedays"/>
                    </div>

                    <div class="form-group">
                        <label><strong><T>names.namedaysComment</T>:</strong></label>
                        <input v-model="form.namedaysComment" class="form-control"/>
                    </div>
                    </template>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="form-group">
                        <label><strong><T>names.pros</T>:</strong></label>
                        <ListInput v-model="form.pros"/>
                    </div>

                    <div class="form-group">
                        <label><strong><T>names.cons</T>:</strong></label>
                        <ListInput v-model="form.cons"/>
                    </div>

                    <div class="form-group">
                        <label><strong><T>names.notablePeople</T>:</strong></label>
                        <ListInput v-model="form.notablePeople"/>
                    </div>

                    <div class="form-group">
                        <label><strong><T>names.links</T>:</strong></label>
                        <ListInput v-model="form.links" v-slot="s">
                            <input v-model="s.val" type="url" class="form-control" @keyup="s.update(s.val)" required/>
                        </ListInput>
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
                    name: '',
                    origin: '',
                    meaning: '',
                    usage: '',
                    legally: '',
                    pros: [],
                    cons: [],
                    notablePeople: [],
                    links: [],
                    namedays: [],
                    namedaysComment: '',
                    base: null,
                },
                submitting: false,
                afterSubmit: false,
            }
        },
        methods: {
            async submit() {
                this.submitting = true;
                try {
                    await this.$post(`/names/submit`, this.form);

                    this.afterSubmit = true;
                    this.form = {
                        name: '',
                        origin: '',
                        meaning: '',
                        usage: '',
                        legally: '',
                        pros: [],
                        cons: [],
                        notablePeople: [],
                        links: [],
                        namedays: [],
                        namedaysComment: '',
                        base: null,
                    };
                } finally {
                    this.submitting = false;
                }
            },
            edit(name) {
                this.form = {
                    name: name.name,
                    origin: name.origin,
                    meaning: name.meaning,
                    usage: name.usage,
                    legally: name.legally,
                    pros: name.pros,
                    cons: name.cons,
                    notablePeople: name.notablePeople,
                    links: name.links,
                    namedays: name.namedays,
                    namedaysComment: name.namedaysComment,
                    base: name.id,
                }
                this.afterSubmit = false;
                this.$el.scrollIntoView();
            }
        },
    };
</script>
