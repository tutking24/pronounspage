<template>
    <ul class="list-unstyled mb-4">
        <li class="mb-2">
            <a href="https://cake.avris.it" target="_blank" rel="noopener">
                <Icon v="cake.png"/>
                Attraction Layer Cake
            </a>
        </li>
        <li class="mb-2">
            <a href="https://spectrum.avris.it" target="_blank" rel="noopener">
                <Icon v="spectrum.png"/>
                Gender & Sexuality Spectrum
            </a>
        </li>
        <li class="mb-2">
            <a href="https://emojiflags.avris.it/" target="_blank" rel="noopener">
                <Icon v="emojiflags.png"/>
                Emoji Pride Flags
            </a>
        </li>
        <li class="mb-2">
            <a v-if="config.locale === 'pl'" href="https://isjp.pl/" target="_blank" rel="noopener">
                <Icon v="isjp.svg"/>
                Inkluzywny Słownik Języka Polskiego
            </a>
            <a v-else href="https://isjp.pl/en" target="_blank" rel="noopener">
                <Icon v="isjp.svg"/>
                Inclusive Polish Spellcheck
            </a>
        </li>
        <li class="mb-2">
            <a href="https://isgc.app/" target="_blank" rel="noopener">
                <Icon v="isgc.png"/>
                GCChecker
            </a>
        </li>
        <li class="mb-2">
            <a href="https://callmebymygender.top/" target="_blank" rel="noopener">
                <Icon v="cmbmg.png"/>
                Call me by my gender
            </a>
        </li>
    </ul>
</template>
