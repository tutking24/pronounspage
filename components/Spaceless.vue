<template>
    <span><slot></slot></span>
</template>

<script>
    export default {
        mounted() {
            this.removeWhitespaces(this.$el);
        },
        methods: {
            removeWhitespaces(parent) {
                for (let child of parent.childNodes) {
                    if (child.nodeName === '#text' && child.textContent.trim() === '') {
                        parent.removeChild(child);
                    }
                    for (let grandchild of child.childNodes) {
                        this.removeWhitespaces(grandchild);
                    }
                }
            }
        },
    }
</script>
