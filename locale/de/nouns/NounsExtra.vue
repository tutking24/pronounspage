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
                        N: 'das Authory', G: 'des Authorys', D: 'dem Authory', A: 'das Authory',
                        N_pl: 'die Authorys', G_pl: 'der Authorys', D_pl: 'der Authorys', A_pl: 'die Authorys',
                    }),
                    'Doppelpunkt-Formen': new NounDeclension({
                        N: 'der:die Author:in', G: 'des:der Authors:in', D: 'dem:der Author:in', A: 'den:die Author:in',
                        N_pl: 'die Author:innen', G_pl: 'der Author:innen', D_pl: 'den Author:innen', A_pl: 'die Author:innen',
                    }),
                    'Unterstrich-Formen': new NounDeclension({
                        N: 'der_die Author_in', G: 'des_der Authors_in', D: 'dem_der Author_in', A: 'den_die Author_in',
                        N_pl: 'die Author_innen', G_pl: 'der Author_innen', D_pl: 'den Author_innen', A_pl: 'die Author_innen',
                    }),
                    'Sternzeichen-Formen': new NounDeclension({
                        N: 'der*die Author*in', G: 'des*der Authors*in', D: 'dem*der Author*in', A: 'den*die Author*in',
                        N_pl: 'die Author*innen', G_pl: 'der Author*innen', D_pl: 'den Author*innen', A_pl: 'die Author*innen',
                    }),
                    'Großbuchstabe-Formen': new NounDeclension({
                        N: '?? AuthorIn', G: '?? AuthorsIn', D: '?? AuthorIn', A: '?? AuthorIn',
                        N_pl: 'die AuthorInnen', G_pl: 'der AuthorInnen', D_pl: 'den AuthorInnen', A_pl: 'die AuthorInnen',
                    }),
                },
            }
        },
    }
</script>
