<template>
    <div class="select flex-grow-1">
        <input type="text" v-model="filter" class="form-control" :placeholder="$t('profile.timezone.placeholder')"
               ref="filter"
               @focus="show" @blur="hide" @keydown="filterKeydown"
        />
        <div class="list-group shadow" v-show="shown">
            <a v-for="(display, option) in visibleOptions"
               :class="['list-group-item', 'list-group-item-action', highlightedOption === option ? 'active' : '']" href="#"
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
            highlighted: -1,
        }
    },
    watch: {
        value() {
            this.filter = this.options[this.value] || this.value;
            this.highlighted = -1;
        },
    },
    methods: {
        select(option) {
            this.$emit('input', option);
            this.hide();
            this.highlighted = -1;
        },
        show() {
            this.shown = true;
        },
        hide() {
            setTimeout(() => { this.shown = false; }, 100)
        },
        filterKeydown(e) {
            if (!this.shown) {
                this.show();
            }

            switch (e.key) {
                case 'ArrowUp':
                    this.highlighted--;
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 'ArrowDown':
                    this.highlighted++;
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 'Enter':
                    if (this.highlightedOption) {
                        this.select(this.highlightedOption);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
                default:
                    break;
            }

            this.$forceUpdate();
        }
    },
    computed: {
        visibleOptions() {
            return Object.fromEntries(Object.entries(this.options).filter(([option, display]) => {
                return !this.filter
                    || option.toLowerCase().includes(this.filter.toLowerCase())
                    || display.toLowerCase().includes(this.filter.toLowerCase())
            }));
        },
        highlightedOption() {
            return Object.keys(this.visibleOptions)[this.highlighted];
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
