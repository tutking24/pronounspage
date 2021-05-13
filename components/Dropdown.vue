<template>
    <div class="dropdown">
        <button :class="['btn dropdown-toggle', btnClass, shown ? 'show active' : '']"
                @click.stop="shown = !shown"
        >
            <slot name="toggle">Dropdown</slot>
        </button>
        <ul :class="['dropdown-menu', end ? 'dropdown-menu-end' : '', shown ? 'show' : '']" >
            <slot name="menu">
                <li class="dropdown-item">Option</li>
            </slot>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            btnClass: { 'default': 'btn-secondary' },
            end: { type: Boolean },
        },
        data() {
            return {
                shown: false,
            };
        },
        methods: {
            documentClicked() {
                if (this.shown) {
                    this.shown = false
                }
            },
        },
        created() {
            if (process.client) {
                document.addEventListener('click', this.documentClicked);
            }
        },
        destroyed() {
            if (process.client) {
                document.removeEventListener('click', this.documentClicked);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .dropdown-menu-end {
        right: 0;
    }
</style>
