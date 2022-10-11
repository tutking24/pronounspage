<template>
    <ListInput v-model="v" :prototype="prototype()" :group="group" :readonly="readonly" :maxlength="maxlength">
        <template v-slot="s">
            <button type="button" :class="['btn', readonly ? 'btn-light border' : 'btn-outline-secondary', showIconSelector === s.i ? 'btn-secondary text-white border' : '']" :disabled="readonly"
                    @click="showIconSelector = showIconSelector === s.i ? false : s.i">
                <Icon :v="s.val.icon"/>
            </button>
            <input v-model="s.val.description" class="form-control" :readonly="readonly"
                   @keyup="s.update(s.val)" @paste="$nextTick(() => s.update(s.val))" @change="s.update(s.val)"
                   required maxlength="24"
                   :placeholder="$t('profile.opinions.description')"
            />
            <select :class="['form-control', s.val.colour ? 'colour-' + s.val.colour : 'text-muted']" v-model="s.val.colour" @change="s.update(s.val)" :disabled="readonly">
                <option v-for="colour in colours" :value="colour">{{$t(`profile.opinions.colours.${colour || '_'}`)}}</option>
            </select>
            <select :class="['form-control', s.val.style || 'text-muted']" v-model="s.val.style" @change="s.update(s.val)" :disabled="readonly">
                <option v-for="st in styles" :value="st">{{$t(`profile.opinions.styles.${st || '_'}`)}}</option>
            </select>

            <IconSelector v-if="showIconSelector === s.i" class="hanging shadow shadow-lg border"
                          :skipIcons="skipIcons"
                          @change="s.update({...s.val, icon: $event}); showIconSelector = false"/>
        </template>
        <template v-slot:validation="s">
            <p v-if="validation(s.val)" class="small text-danger">
                <Icon v="exclamation-triangle"/>
                <span class="ml-1">{{$t(validation(s.val))}}</span>
            </p>
        </template>
    </ListInput>
</template>


<script>
import { colours, styles } from '../src/styling';
import opinions from '../src/opinions';

export default {
    props: {
        value: {},
        group: {},
        readonly: { type: Boolean },
        maxlength: { 'default': null },
    },
    data() {
        return {
            v: this.value,
            showIconSelector: false,
            colours,
            styles,
            skipIcons: [...Object.values(opinions).map(op => op.icon), 'ad'],
        }
    },
    watch: {
        v() { this.$emit('input', this.v); },
        value(v) { this.v = v; }
    },
    methods: {
        prototype() {
            return {icon: '', description: '', colour: '', style: ''};
        },
        setIcon(icon) {
            this.v.icon = icon;
            this.showIconSelector = false;
            this.$emit('input', this.v);
        },
        validation(v) {
            if (JSON.stringify(v) === JSON.stringify(this.prototype())) {
                return null;
            }

            if (!v.icon) {
                return 'profile.opinions.validation.missingIcon';
            }
            if (!v.description) {
                return 'profile.opinions.validation.missingDescription';
            }
            if (this.v.filter(el => el.icon === v.icon).length > 1) {
                return 'profile.opinions.validation.duplicateIcon';
            }
            if (this.v.filter(el => el.description === v.description).length > 1) {
                return 'profile.opinions.validation.duplicateDescription';
            }

            return null;
        }
    },
}
</script>

<style lang="scss" scoped>
@import "assets/variables";

// TODO
select > option.small {
    font-size: $small-font-size !important;
}

.hanging {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-width: 500px;
    z-index: 5000;
}

</style>
