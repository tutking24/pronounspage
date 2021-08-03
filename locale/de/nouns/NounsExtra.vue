<template>
    <div>
        <Separator icon="pen-nib"/>
        <h3>TODO // how to call this section?</h3>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dictum mi et felis volutpat,
            quis posuere nulla bibendum. Nunc hendrerit ipsum sit amet nulla blandit, non interdum lectus vehicula.
            Phasellus vehicula convallis tellus, quis viverra metus tempor placerat. Phasellus volutpat porta dolor,
            sed tincidunt tortor tincidunt sit amet. In dignissim sem viverra sapien posuere, pulvinar molestie
            enim malesuada.
        </p>
        <p>
            Fusce sit amet facilisis est, quis tincidunt tortor. Ut ullamcorper nulla nisi,
            facilisis efficitur ex faucibus ac. Sed non magna justo. Vivamus pharetra leo sed cursus gravida.
            Aenean placerat placerat quam a egestas.
        </p>
        <div class="row">
            <div v-for="(declension, name) in declensions" class="col-12 col-lg-4">
                <h4>{{ name }}</h4>
                <h5 class="h6">⋅ <T>nouns.singular</T></h5>
                <Declension word="" :template="declension" open/>
                <h5 class="h6">⁖ <T>nouns.plural</T></h5>
                <Declension word="" :template="declension" open plural/>
            </div>
        </div>
        <Separator icon="book-open"/>
        <slot></slot>
    </div>
</template>

<script>
    import {NounDeclension} from "../../../src/classes";
    import NounsNav from "./NounsNav";

    export default {
        components: { NounsNav },
        data() {
            return {
                declensions: {
                    'Y-Formen': new NounDeclension({
                        N: 'das Autory', G: 'des Autorys', D: 'dem Autory', A: 'das Autory',
                        N_pl: 'die Autorys', G_pl: 'der Autorys', D_pl: 'den Autorys', A_pl: 'die Autorys',
                    }),
                    'Inklusivum': new NounDeclension({
                        N: 'de Autore', G: 'dern Autore', D: 'dern Autore', A: 'de Autore',
                        N_pl: 'die Autorne', G_pl: 'der Autorne', D_pl: 'den Autorne', A_pl: 'die Autorne',
                    }),
                    'Doppelpunkt-Formen': new NounDeclension({
                        N: 'der:die Autor:in', G: 'des:der Autors:in', D: 'dem:der Autor:in', A: 'den:die Autor:in',
                        N_pl: 'die Autor:innen', G_pl: 'der Autor:innen', D_pl: 'den Autor:innen', A_pl: 'die Autor:innen',
                    }),
                    'Unterstrich-Formen': new NounDeclension({
                        N: 'der_die Autor_in', G: 'des_der Autors_in', D: 'dem_der Autor_in', A: 'den_die Autor_in',
                        N_pl: 'die Autor_innen', G_pl: 'der Autor_innen', D_pl: 'den Autor_innen', A_pl: 'die Autor_innen',
                    }),
                    'Sternzeichen-Formen': new NounDeclension({
                        N: 'der*die Autor*in', G: 'des*der Autors*in', D: 'dem*der Autor*in', A: 'den*die Autor*in',
                        N_pl: 'die Autor*innen', G_pl: 'der Autor*innen', D_pl: 'den Autor*innen', A_pl: 'die Autor*innen',
                    }),
                    'Großbuchstabe-Formen': new NounDeclension({
                        N: 'derDie AutorIn', G: 'desDer AutorIn', D: 'demDer AutorIn', A: 'denDie AutorIn',
                        N_pl: 'die AutorInnen', G_pl: 'der AutorInnen', D_pl: 'den AutorInnen', A_pl: 'die AutorInnen',
                    }),
                },
            }
        },
    }
</script>
