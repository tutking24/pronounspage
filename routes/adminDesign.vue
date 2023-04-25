<template>
    <Page>
    <NotFound v-if="!$isGranted()"/>
    <div v-else>
        <p>
            <nuxt-link to="/admin">
                <Icon v="user-cog"/>
                <T>admin.header</T>
            </nuxt-link>
        </p>
        <h2>
            <Icon v="palette"/>
            Design guidelines
        </h2>

        <p>
            If you're a contributor creating some kind of visual content for the project, here's a bunch of resources you might find useful:
        </p>

        <h3>Fonts</h3>
        <ul>
            <li class="h5">
                <strong>Headings:</strong>
                <span class="font"></span>
            </li>
            <li>
                <strong>Text:</strong>
                <span class="font"></span>
            </li>
        </ul>
        <p>Keep in mind that we might be using different fonts for non-Latin scripts.</p>

        <h3>Colours</h3>
        <div class="d-flex border rounded mb-3">
            <div v-for="colour in ['#c71585', '#8b0f7a', '#15c79c']"
                 :class="['text-center', 'p-2', 'flex-grow-1', 'text-white']"
                 :style="`background-color: ${colour}`">
                {{ colour }}
            </div>
        </div>
        <div class="d-flex border rounded mb-3">
            <div v-for="colour in ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']"
                 :class="[`bg-${colour}`, 'text-center', 'p-2', 'flex-grow-1', ['dark', 'primary'].includes(colour) ? 'text-white' : '']">
                <strong>{{ colour }}</strong>
                <br/>
                <span class="colour"></span>
            </div>
        </div>

        <h3>Images</h3>
        <ul>
            <li>
                <a href="/logo/logo-primary.svg" target="_blank" rel="noopener">
                    Project logo
                </a>
            </li>
            <li>
                <nuxt-link :to="`${config.contact.team.route}`" target="_blank" rel="noopener">
                    Team logo
                </nuxt-link>
            </li>
            <li>
                <a href="/bg.png" target="_blank" rel="noopener">
                    Background
                </a>
            </li>
        </ul>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";

const rgbToHex = (rgb) => {
    if (!rgb.startsWith('rgb(')) { return rgb; }
    const [r, g, b] = rgb.replace(/^rgb\(/, '').replace(/\)$/, '').split(',')
    return `#${parseInt(r.trim()).toString(16)}${parseInt(g.trim()).toString(16)}${parseInt(b.trim()).toString(16)}`;
}

export default {
    mounted() {
        if (!process.client) { return; }
        this.$el.querySelectorAll('.colour').forEach(el => {
            el.innerHTML = rgbToHex(getComputedStyle(el.parentElement).getPropertyValue('background-color'));
        });
        this.$el.querySelectorAll('.font').forEach(el => {
            el.innerHTML = getComputedStyle(el.parentElement).getPropertyValue('font-family').split(',')[0];
        });
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Design guidelines',
        });
    },
}
</script>
