<template>
    <div :class="'separator separator-' + colour">
        <div class="mask"></div>
        <span v-if="icon"><Icon :v="icon"/></span>
    </div>
</template>

<script>
    export default {
        props: {
            icon: { },
            colour: { 'default': 'primary' },
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
            display: grid;
            place-items: center;
        }
    }

    @each $color, $value in $theme-colors {
        .separator-#{$color} {
            > .mask {
                &:after {
                    box-shadow: 0 0 $size/5 $value;
                }
            }
            > span {
                box-shadow:0 2px 4px $value;
                background: theme-color-level($color, $alert-bg-level);
                color: $value;
            }
        }
    }
</style>

