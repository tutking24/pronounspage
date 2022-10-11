<template>
    <ListInput v-model="v" :prototype="{value: '', opinion: 'meh'}" :group="group">
        <template v-slot="s">
            <button type="button" :class="['btn', 'btn-outline-secondary', showOpinionSelector === s.i ? 'btn-secondary text-white border' : (validate(s.val) ? 'btn-outline-danger' : '')]"
                    @click="showOpinionSelector = showOpinionSelector === s.i ? false : s.i">
                <Icon :v="getIcon(s.val.opinion)"/>
            </button>
            <input v-model="s.val.value" :class="['form-control', 'mw-input', validate(s.val) ? 'border-danger' : '']" @keyup="s.update(s.val)" required/>

            <div v-if="showOpinionSelector === s.i" class="bg-light border rounded hanging shadow shadow-lg">
                <ul class="list-unstyled icons-list p-1 text-center mb-0">
                    <li v-for="(opinion, key) in opinions"
                        class="list-inline-item">
                        <button :class="['btn', key === s.val.opinion ? 'btn-dark' : 'btn-outline-dark', 'border-0 my-2']" @click.prevent="s.val.opinion = key; showOpinionSelector = false">
                            <Icon :v="opinion.icon"/>
                        </button>
                    </li>
                </ul>
                <ul v-if="customOpinions.length" class="list-unstyled icons-list p-1 text-center mb-0">
                    <li v-for="opinion in customOpinions"
                        class="list-inline-item">
                        <button :class="['btn', opinion.icon === s.val.opinion ? 'btn-dark' : 'btn-outline-dark', 'border-0 my-2']" @click.prevent="s.val.opinion = opinion.icon; showOpinionSelector = false">
                            <Icon :v="opinion.icon"/>
                        </button>
                    </li>
                </ul>
            </div>
        </template>
        <template v-slot:validation="s">
            <p v-if="validate(s.val)" class="small text-danger">
                <Icon v="exclamation-triangle"/>
                <span class="ml-1">{{$t(validate(s.val))}}</span>
            </p>
        </template>
    </ListInput>
</template>

<script>
    import opinions from '../src/opinions';

    export default {
        props: {
            value: {},
            group: {},
            validation: {},
            customOpinions: { 'default': () => { return [] }},
        },
        data() {
            return {
                v: this.value,
                showOpinionSelector: false,
                opinions,
            }
        },
        watch: {
            v() { this.$emit('input', this.v); },
            value(v) { this.v = v; }
        },
        methods: {
            validate(val) {
                if (!this.getIcon(val.opinion)) {
                    return 'profile.opinions.validation.invalidOpinion';
                }

                if (!val.value) { return null; }

                return this.validation && this.validation(val.value);
            },
            getIcon(opinion) {
                if (opinions.hasOwnProperty(opinion)) {
                    return opinions[opinion].icon;
                }
                for (let op of this.customOpinions) {
                    if (op.icon === opinion) {
                        return opinion;
                    }
                }

                return '';
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    .hanging {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        max-width: 300px;
        z-index: 5000;
    }
</style>
