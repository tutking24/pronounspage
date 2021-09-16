<template>
    <div>
        <Separator icon="pen-nib"/>
        <h3>Deklinationsmuster</h3>
        <p>
            Die Folgenden sind vorschläge für ein Deklinationsmuster für verschiedene Formen von geschlechtsneutralen Substantiven.
        </p>
        <ul class="list-group mt-4">
            <li v-for="({declension, extendedDeclension, info = null, warning = null}, name) in declensions" class="list-group-item" :id="name">
                <h4>{{ name }}</h4>
                <div v-if="info" class="alert alert-info small">
                    <Icon v="info-circle"/>
                    <LinkedText :text="info"/>
                </div>
                <div v-if="warning" class="alert alert-warning small">
                    <Icon v="exclamation-triangle"/>
                    <LinkedText :text="warning"/>
                </div>
                <div class="row">
                    <div v-if="declension"  class="col-12 col-md-4">
                        <div class="mb-3">
                            <h5 class="h6">⋅ <T>nouns.singular</T></h5>
                            <Declension word="" :template="declension" open/>
                        </div>
                        <div class="mb-3">
                            <h5 class="h6">⁖ <T>nouns.plural</T></h5>
                            <Declension word="" :template="declension" open plural/>
                        </div>
                    </div>
                    <div v-if="extendedDeclension" class="col-12 col-md-8">
                        <div class="mb-3">
                        <h5 class="h6">⋅ <T>nouns.singular</T></h5>
                        <Declension word="" :template="extendedDeclension" open/>
                    </div>
                        <div class="mb-3">
                            <h5 class="h6">⁖ <T>nouns.plural</T></h5>
                            <Declension word="" :template="extendedDeclension" open plural/>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
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
                    'Y-Formen': {
                        declension: new NounDeclension({
                            N: 'das Arbeity', G: 'des Arbeitys', D: 'dem Arbeity', A: 'das Arbeity',
                            N_pl: 'die Arbeitys', G_pl: 'der Arbeitys', D_pl: 'den Arbeitys', A_pl: 'die Arbeitys',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein bestes Lehry', G: 'meines besten Lehrys', D: 'meinem besten Lehry', A: 'mein bestes Lehry',
                            N_pl: 'meine besten Lehrys', G_pl: 'meiner besten Lehrys', D_pl: 'meinen besten Lehrys', A_pl: 'meine besten Lehrys',
                        }),
                    },
                    'Inklusivum': {
                        info: 'Formen vorgestellt vom {https://geschlechtsneutral.net/=Verein für geschlechtsneutrales Deutsch}.',
                        declension: new NounDeclension({
                            N: 'de Arbeitere', G: 'dern Arbeiteres', D: 'dern Arbeitere', A: 'de Arbeitere',
                            N_pl: 'die Arbeitererne', G_pl: 'der Arbeitererne', D_pl: 'den Arbeiterernen', A_pl: 'die Arbeitererne',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein beste Lehrere', G: 'meinern besten Lehreres', D: 'meinern besten Lehrere', A: 'mein beste Lehrere',
                            N_pl: 'meine besten Lehrerne', G_pl: 'meiner besten Lehrerne', D_pl: 'meinen besten Lehrernen', A_pl: 'meine besten Lehrerne',
                        }),
                    },
                    'Ojum': {
                        info: `
                            Formen vorgestellt von {https://www.frumble.de/blog/2021/03/26/ueberlegungen-zu-einer-genderneutralen-deutschen-grammatik=Frumble}.<br/><br/>
                            Siehe auch: {/oj=Neopronomen „oj/ojm“}.<br/><br/>
                            Die Idee ist, die theoretisch unspezifischen Formen auf -t, -ent, -ant und -or im Singular nicht durchzugendern:
                            Wird das Ojum bei -er statt des generischen Maskulinums der Standard, verändert sich mittelfristig voraussichtlich
                            die Spracherwartung und ein inklusiver Artikel davor reicht, um diese Formen als genderneutral zu markieren
                            und die gewohnten Kurzformen erhalten zu können. Trotzdem ist kurzfristig auch immer explizite Singular-Genderung mit -u freigestellt.
                        `,
                        declension: new NounDeclension({
                            N: 'dej Arbeitu', G: 'dejs Arbeitus', D: 'dojm Arbeitu', A: 'dojn Arbeitu',
                            N_pl: 'die Arbeitoj', G_pl: 'der Arbeitoj', D_pl: 'den Arbeitojn', A_pl: 'die Arbeitoj',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'meinu bestu Lehru', G: 'meinus besten Lehrus', D: 'meinum besten Lehru', A: 'meinun bestu Lehru',
                            N_pl: 'meine besten Lehroj', G_pl: 'meiner besten Lehroj', D_pl: 'meinen besten Lehrojn', A_pl: 'meine besten Lehrojn',
                        }),
                    },
                    'Doppelpunkt-Formen': {
                        declension: new NounDeclension({
                            N: 'der:die Arbeiter:in', G: 'des:der Arbeiters:in', D: 'dem:der Arbeiter:in', A: 'den:die Arbeiter:in',
                            N_pl: 'die Arbeiter:innen', G_pl: 'der Arbeiter:innen', D_pl: 'den Arbeiter:innen', A_pl: 'die Arbeiter:innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein:e beste:r Lehrer:in', G: 'meines:r besten Lehrer:in', D: 'meinem:r besten Lehrer:in', A: 'meine:n beste:n Lehrer:in',
                            N_pl: 'meine besten Lehrer:innen', G_pl: 'meiner besten Lehrer:innen', D_pl: 'meinen besten Lehrer:innen', A_pl: 'meine besten Lehrer:innen',
                        }),
                    },
                    'Unterstrich-Formen': {
                        declension: new NounDeclension({
                            N: 'der_die Arbeiter_in', G: 'des_der Arbeiters_in', D: 'dem_der Arbeiter_in', A: 'den_die Arbeiter_in',
                            N_pl: 'die Arbeiter_innen', G_pl: 'der Arbeiter_innen', D_pl: 'den Arbeiter_innen', A_pl: 'die Arbeiter_innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein_e beste_r Lehrer_in', G: 'meines_r besten Lehrer_in', D: 'meinem_r besten Lehrer_in', A: 'meine_n beste_n Lehrer_in',
                            N_pl: 'meine besten Lehrer_innen', G_pl: 'meiner besten Lehrer_innen', D_pl: 'meinen besten Lehrer_innen', A_pl: 'meine besten Lehrer_innen',
                        }),
                    },
                    'Sternchen-Formen': {
                        declension: new NounDeclension({
                            N: 'der*die Arbeiter*in', G: 'des*der Arbeiters*in', D: 'dem*der Arbeiter*in', A: 'den*die Arbeiter*in',
                            N_pl: 'die Arbeiter*innen', G_pl: 'der Arbeiter*innen', D_pl: 'den Arbeiter*innen', A_pl: 'die Arbeiter*innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein*e beste*r Lehrer*in', G: 'meines*r besten Lehrer*in', D: 'meinem*r besten Lehrer*in', A: 'meine*n beste*n Lehrer*in',
                            N_pl: 'meine besten Lehrer*innen', G_pl: 'meiner besten Lehrer*innen', D_pl: 'meinen besten Lehrer*innen', A_pl: 'meine besten Lehrer*innen',
                        }),
                    },
                    'Großbuchstabe-Formen': {
                        warning: 'Formen wie z.B. „ArbeiterIn“ oder „LehrerInnen“. Das Binnen-I bezieht sich nur auf die männliche und die weibliche Form der Wörter und schließt damit (wie das generische Maskulinium) immer noch sehr viele Menschen aus der Sprache aus. Deshalb ist diese Variante genauso wenig zu empfehlen wie das generische Maskulinum oder Femininum.',
                        // declension: new NounDeclension({
                        //     N: 'derDie ArbeiterIn', G: 'desDer ArbeiterIn', D: 'demDer ArbeiterIn', A: 'denDie ArbeiterIn',
                        //     N_pl: 'die ArbeiterInnen', G_pl: 'der ArbeiterInnen', D_pl: 'den ArbeiterInnen', A_pl: 'die ArbeiterInnen',
                        // }),
                        // extendedDeclension: new NounDeclension({
                        //     N: 'meinE besteR LehrerIn', G: 'meinesR besten LehrerIn', D: 'meinemR besten LehrerIn', A: 'meineN besteN LehrerIn',
                        //     N_pl: 'meine besten LehrerInnen', G_pl: 'meiner besten LehrerInnen', D_pl: 'meinen besten LehrerInnen', A_pl: 'meine besten LehrerInnen',
                        // }),
                    },
                },
            }
        },
    }
</script>
