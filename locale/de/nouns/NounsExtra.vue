<template>
    <div>
        <Separator icon="pen-nib"/>
        <h3>Deklinationsmuster</h3>
        <p>
            Die Folgenden sind vorschläge für ein Deklinationsmuster für verschiedene Formen von geschlechtsneutralen Substantiven.
        </p>
        <ul class="list-group mt-4">
            <li v-for="({declension, extendedDeclension, info = null, warning = null}, name) in declensions" class="list-group-item">
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
                            N: 'das Autory', G: 'des Autorys', D: 'dem Autory', A: 'das Autory',
                            N_pl: 'die Autorys', G_pl: 'der Autorys', D_pl: 'den Autorys', A_pl: 'die Autorys',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein bestes Lehry', G: 'meines besten Lehrys', D: 'meinem besten Lehry', A: 'mein bestes Lehry',
                            N_pl: 'meine besten Lehrys', G_pl: 'meiner besten Lehrys', D_pl: 'meinen besten Lehrys', A_pl: 'meine besten Lehrys',
                        }),
                    },
                    'Inklusivum': {
                        info: 'Formen vorgestellt vom {https://geschlechtsneutral.net/=Verein für geschlechtsneutrales Deutsch}.',
                        declension: new NounDeclension({
                            N: 'de Autore', G: 'dern Autores', D: 'dern Autore', A: 'de Autore',
                            N_pl: 'die Autorerne', G_pl: 'der Autorerne', D_pl: 'den Autorernen', A_pl: 'die Autorerne',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein beste Lehrere', G: 'meinern besten Lehreres', D: 'meinern besten Lehrere', A: 'mein beste Lehrere',
                            N_pl: 'meine besten Lehrerne', G_pl: 'meiner besten Lehrerne', D_pl: 'meinen besten Lehrernen', A_pl: 'meine besten Lehrerne',
                        }),
                    },
                    'U-Formen': {
                        info: 'Formen vorgestellt vom {https://www.frumble.de/blog/2021/03/26/ueberlegungen-zu-einer-genderneutralen-deutschen-grammatik=Maximilian}.',
                        declension: new NounDeclension({
                            N: 'dej Autoru', G: '?? Autoru', D: '?? Autoru', A: '?? Autoru',
                            N_pl: 'die Autoroj', G_pl: 'der Autoroj', D_pl: 'den Autorojn', A_pl: 'die Autoroj',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein bestes Lehreru', G: 'meinern besten Lehreru', D: 'meinern besten Lehreru', A: 'mein bestes Lehreru',
                            N_pl: 'meine besten Lehreroj', G_pl: 'meiner besten Lehreroj', D_pl: 'meinen besten Lehrerojn', A_pl: 'meine besten Lehrerojn',
                        }),
                    },
                    'Doppelpunkt-Formen': {
                        declension: new NounDeclension({
                            N: 'der:die Autor:in', G: 'des:der Autors:in', D: 'dem:der Autor:in', A: 'den:die Autor:in',
                            N_pl: 'die Autor:innen', G_pl: 'der Autor:innen', D_pl: 'den Autor:innen', A_pl: 'die Autor:innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein:e beste:r Lehrer:in', G: 'meines:r besten Lehrer:in', D: 'meinem:r besten Lehrer:in', A: 'meine:n beste:n Lehrer:in',
                            N_pl: 'meine besten Lehrer:innen', G_pl: 'meiner besten Lehrer:innen', D_pl: 'meinen besten Lehrer:innen', A_pl: 'meine besten Lehrer:innen',
                        }),
                    },
                    'Unterstrich-Formen': {
                        declension: new NounDeclension({
                            N: 'der_die Autor_in', G: 'des_der Autors_in', D: 'dem_der Autor_in', A: 'den_die Autor_in',
                            N_pl: 'die Autor_innen', G_pl: 'der Autor_innen', D_pl: 'den Autor_innen', A_pl: 'die Autor_innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein_e beste_r Lehrer_in', G: 'meines_r besten Lehrer_in', D: 'meinem_r besten Lehrer_in', A: 'meine_n beste_n Lehrer_in',
                            N_pl: 'meine besten Lehrer_innen', G_pl: 'meiner besten Lehrer_innen', D_pl: 'meinen besten Lehrer_innen', A_pl: 'meine besten Lehrer_innen',
                        }),
                    },
                    'Sternchen-Formen': {
                        declension: new NounDeclension({
                            N: 'der*die Autor*in', G: 'des*der Autors*in', D: 'dem*der Autor*in', A: 'den*die Autor*in',
                            N_pl: 'die Autor*innen', G_pl: 'der Autor*innen', D_pl: 'den Autor*innen', A_pl: 'die Autor*innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein*e beste*r Lehrer*in', G: 'meines*r besten Lehrer*in', D: 'meinem*r besten Lehrer*in', A: 'meine*n beste*n Lehrer*in',
                            N_pl: 'meine besten Lehrer*innen', G_pl: 'meiner besten Lehrer*innen', D_pl: 'meinen besten Lehrer*innen', A_pl: 'meine besten Lehrer*innen',
                        }),
                    },
                    'Großbuchstabe-Formen': {
                        warning: 'Formen wie z.B. „AutorIn“ oder „LehrerInnen“. Das Binnen-I bezieht sich nur auf die männliche und die weibliche Form der Wörter und schließt damit (wie das generische Maskulinium) immer noch sehr viele Menschen aus der Sprache aus. Deshalb ist diese Variante genauso wenig zu empfehlen wie das generische Maskulinum oder Femininum.',
                        // declension: new NounDeclension({
                        //     N: 'derDie AutorIn', G: 'desDer AutorIn', D: 'demDer AutorIn', A: 'denDie AutorIn',
                        //     N_pl: 'die AutorInnen', G_pl: 'der AutorInnen', D_pl: 'den AutorInnen', A_pl: 'die AutorInnen',
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
