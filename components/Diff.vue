<template>
    <component :is="block || switchable ? 'div' : 'span'">
        <ul v-if="switchable" class="nav nav-tabs">
            <li v-for="v in views" class="nav-item">
                <a :class="['nav-link', v === selectedView ? 'active' : '']"  href="#" @click.prevent="selectedView = v">
                    {{ v }}
                    <span v-if="v === 'diff' && countChanges > 0" class="badge bg-warning">{{ countChanges }}</span>
                </a>
            </li>
        </ul>
        <component :is="block || switchable ? 'div' : 'span'" :class="block || switchable ? 'tab-content bg-white p-3' : ''">
            <span ref="before" v-show="selectedView === 'before'">
                <slot name="before"></slot>
            </span>
            <span ref="after" v-show="selectedView === 'after'">
                <slot name="after"></slot>
            </span>
            <span ref="diff" v-show="selectedView === 'diff'"></span>
        </component>
    </component>
</template>

<script>
import diff from 'generic-diff';

export default {
    props: {
        view: {'default': 'diff'},
        switchable: {type: Boolean},
        block: {type: Boolean}
    },
    data() {
        return {
            views: ['before', 'after', 'diff'],
            selectedView: this.view,
            diff: [],
        }
    },
    mounted() {
        this.update();

        this.observerBefore = new MutationObserver(this.update);
        this.observerBefore.observe(this.$refs.before, {
            childList: true,
            subtree: true
        });

        this.observerAfter = new MutationObserver(this.update);
        this.observerAfter.observe(this.$refs.after, {
            childList: true,
            subtree: true
        });
    },
    beforeUnmount() {
        this.observerBefore.disconnect();
        this.observerAfter.disconnect();
    },
    methods: {
        update() {
            this.diff = diff(
                this.$refs.before.innerHTML,
                this.$refs.after.innerHTML,
            )

            this.$refs.diff.innerHTML = this.diff.map(function (edit) {
                if (edit.added) {
                    return '<ins>' + edit.items.join('') + '</ins>'
                } else if (edit.removed) {
                    return '<del>' + edit.items.join('') + '</del>'
                } else {
                    return edit.items.join('')
                }
            }).join('');
        },
    },
    computed: {
        countChanges() {
            return this.diff.filter(d => d.added || d.removed).length;
        }
    }
};
</script>

<style lang="scss">
@import "assets/variables";
ins {
    background-color: $green-200;
    padding: .2em;
    &:empty::before {
        content: '<<< +++ block';
    }
}
del {
    background-color: $red-200;
    padding: .2em;
    &:empty::before {
        content: '<<< --- block';
    }
}
</style>
