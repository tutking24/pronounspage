<template>
    <div class="select flex-grow-1">
        <input type="text" v-model="filter" class="form-control" @focus="show" @blur="hide" :placeholder="$t('profile.timezone.placeholder')"/>
        <div class="list-group shadow" v-show="shown">
            <a v-for="(display, option) in options"
               v-if="!filter || option.toLowerCase().includes(filter.toLowerCase()) || display.toLowerCase().includes(filter.toLowerCase())"
               class="list-group-item list-group-item-action" href="#"
               @click.prevent="select(option)">
                {{ display }}
            </a>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        value: {},
        options: { required: true },
    },
    data() {
        return {
            filter: this.options[this.value] || this.value || '',
            shown: false,
        }
    },
    watch: {
        value() {
            this.filter = this.options[this.value] || this.value;
        },
    },
    methods: {
        select(option) {
            this.$emit('input', option);
            this.hide();
        },
        show() {
            this.shown = true;
        },
        hide() {
            setTimeout(() => { this.shown = false; }, 100)
        },
    }
}
</script>

<style lang="scss" scoped>
.select {
    position: relative;
    .list-group {
        position: absolute;
        top: 100%;
        max-height: 300px;
        width: min(300px, 100%);
        overflow-y: auto;
        z-index: 999;
    }
}
</style>
