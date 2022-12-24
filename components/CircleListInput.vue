<template>
    <ListInput v-model="v" :prototype="prototype()" :group="group" :readonly="readonly" :maxitems="maxitems">
        <template v-slot="s">
            <input v-model="s.val.username" type="text" class="form-control"
                   :placeholder="`@${$t('user.account.changeUsername.header').toLowerCase()}`"
                   @input="validateUser(s.val.username)"
                   @keyup="validateUser(s.val.username)"
                   required/>
            <button v-if="s.val.username" type="button" :class="['btn', accountStatus(s.val.username).btn]" @click.prevent :key="updateKey">
                <Tooltip v-if="accountStatus(s.val.username).text" :text="$t(accountStatus(s.val.username).text)">
                    <Icon :v="accountStatus(s.val.username).icon"/>
                </Tooltip>
                <Icon v-else :v="accountStatus(s.val.username).icon"/>
            </button>
            <input v-model="s.val.relationship" type="text" class="form-control"
                   :placeholder="$t('profile.circles.relationship')"
                   required maxlength="64"/>
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

// TODO remove duplication
const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // https://stackoverflow.com/a/6969486/3297012
const normalise = s => decodeURIComponent(s.trim().toLowerCase());
const normaliseWithLink = s => normalise(s.replace(/^@/, '').replace(new RegExp('^https://.*?/@'), ''))

export default {
    props: {
        value: {},
        group: {},
        readonly: { type: Boolean },
        maxitems: { 'default': null },
    },
    data() {
        const validateUserCache = {};
        for (let connection of this.value) {
            validateUserCache[connection.username] = [connection.locale];
        }

        return {
            v: this.value,
            validateUserHandle: undefined,
            validateUserCache,
            updateKey: 0,
        }
    },
    watch: {
        v() { this.$emit('input', this.v); },
        value(v) { this.v = v; }
    },
    methods: {
        prototype() {
            return {username: '', relationship: ''};
        },
        validation(v) {
            if (JSON.stringify(v) === JSON.stringify(this.prototype())) {
                return null;
            }

            if (this.accountStatus(v.username).value === false) {
                return 'profile.circles.validation.userNotFound'
            }

            if (!v.relationship) {
                return 'profile.circles.validation.required';
            }

            return null;
        },
        validateUser(v) {
            if (this.validateUserHandle) {
                clearTimeout(this.validateUserHandle);
            }
            if (!v || this.validateUserCache.hasOwnProperty(v)) {
                return;
            }
            this.validateUserHandle = setTimeout(async () => {
                let res = await this.$axios.$get(`/profile/versions/${encodeURIComponent(normaliseWithLink(v))}`);
                if (!Array.isArray(res)) {
                    console.error(res);
                    res = [];
                }
                this.validateUserCache[v] = res;
                this.updateKey++;
            }, 500)
        },
        accountStatus(v) {
            if (this.validateUserCache[v] === undefined) {
                return {
                    value: undefined,
                    btn: 'btn-secondary text-white border',
                    icon: 'spinner',
                };
            }
            if (this.validateUserCache[v].length) {
                return {
                    value: true,
                    btn: 'btn-outline-success',
                    icon: 'check-circle',
                };
            }
            return {
                value: false,
                btn: 'btn-outline-danger',
                icon: 'times-circle',
                text: 'profile.circles.validation.userNotFound',
            };
        },
    },
}
</script>
