<template>
    <div class="separator">
        <div class="mask"></div>
        <span v-if="icon"><Icon :v="icon"/></span>
    </div>
</template>

<script>
    export default {
        props: {
            icon: { }
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/style";

    // https://front-back.com/pure-css-3-fancy-separator/

    $size: 50px;

    .separator {
        margin-top: $size;
        position: relative;

        > .mask {
            overflow: hidden;
            height: $size/2;
            &:after {
                content:'';
                display: block;
                margin: -$size/2 auto 0;
                width: 100%;
                height: $size/2;
                border-radius: 125px / 12px;
                box-shadow: 0 0 $size/5 $primary;
            }
        }
        > span {
            width: $size;
            height: $size;
            position: absolute;
            bottom: 100%;
            margin-bottom: -$size/2;
            left: 50%;
            margin-left: -$size/2;
            border-radius: 100%;
            box-shadow:0 2px 4px $primary;
            background: theme-color-level('primary', $alert-bg-level);
            color: $primary;
            display: grid;
            place-items: center;
        }
    }
</style>

