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
                    <div class="col-12 col-md-4">
                        <div class="mb-3">
                            <h5 class="h6">⋅ <T>nouns.singular</T></h5>
                            <Declension word="" :template="declension" open/>
                        </div>
                        <div class="mb-3">
                            <h5 class="h6">⁖ <T>nouns.plural</T></h5>
                            <Declension word="" :template="declension" open plural/>
                        </div>
                    </div>
                    <div class="col-12 col-md-8">
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
                            N: 'mein bestes Freundy', G: 'meines besten Freundys', D: 'meinem besten Freundy', A: 'mein bestes Freundy',
                            N_pl: 'meine besten Freundys', G_pl: 'meiner besten Freundys', D_pl: 'meinen besten Freundys', A_pl: 'meine besten Freundys',
                        }),
                    },
                    'Inklusivum': {
                        info: 'Formen vorgestellt vom {https://geschlechtsneutral.net/=Verein für geschlechtsneutrales Deutsch}.',
                        declension: new NounDeclension({
                            N: 'de Autore', G: 'dern Autores', D: 'dern Autore', A: 'de Autore',
                            N_pl: 'die Autorerne', G_pl: 'der Autorerne', D_pl: 'den Autorernen', A_pl: 'die Autorerne',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein beste Freundere', G: 'meinern besten Freunderes', D: 'meinern besten Freundere', A: 'mein beste Freundere',
                            N_pl: 'meine besten Freunderne', G_pl: 'meiner besten Freunderne', D_pl: 'meinen besten Freundernen', A_pl: 'meine besten Freunderne',
                        }),
                    },
                    'Doppelpunkt-Formen': {
                        declension: new NounDeclension({
                            N: 'der:die Autor:in', G: 'des:der Autors:in', D: 'dem:der Autor:in', A: 'den:die Autor:in',
                            N_pl: 'die Autor:innen', G_pl: 'der Autor:innen', D_pl: 'den Autor:innen', A_pl: 'die Autor:innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein:e beste:r Freund:in', G: 'meines:r besten Freund:in', D: 'meinem:r besten Freund:in', A: 'meine:n beste:n Freund:in',
                            N_pl: 'meine besten Freund:innen', G_pl: 'meiner besten Freund:innen', D_pl: 'meinen besten Freund:innen', A_pl: 'meine besten Freund:innen',
                        }),
                    },
                    'Unterstrich-Formen': {
                        declension: new NounDeclension({
                            N: 'der_die Autor_in', G: 'des_der Autors_in', D: 'dem_der Autor_in', A: 'den_die Autor_in',
                            N_pl: 'die Autor_innen', G_pl: 'der Autor_innen', D_pl: 'den Autor_innen', A_pl: 'die Autor_innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein_e beste_r Freund_in', G: 'meines_r besten Freund_in', D: 'meinem_r besten Freund_in', A: 'meine_n beste_n Freund_in',
                            N_pl: 'meine besten Freund_innen', G_pl: 'meiner besten Freund_innen', D_pl: 'meinen besten Freund_innen', A_pl: 'meine besten Freund_innen',
                        }),
                    },
                    'Sternchen-Formen': {
                        declension: new NounDeclension({
                            N: 'der*die Autor*in', G: 'des*der Autors*in', D: 'dem*der Autor*in', A: 'den*die Autor*in',
                            N_pl: 'die Autor*innen', G_pl: 'der Autor*innen', D_pl: 'den Autor*innen', A_pl: 'die Autor*innen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'mein*e beste*r Freund*in', G: 'meines*r besten Freund*in', D: 'meinem*r besten Freund*in', A: 'meine*n beste*n Freund*in',
                            N_pl: 'meine besten Freund*innen', G_pl: 'meiner besten Freund*innen', D_pl: 'meinen besten Freund*innen', A_pl: 'meine besten Freund*innen',
                        }),
                    },
                    'Großbuchstabe-Formen': {
                        warning: 'Das Binnen-I bezieht sich nur auf die männliche und die weibliche Form der Wörter und schließt damit (wie das generische Maskulinium) immer noch sehr viele Menschen aus der Sprache aus. Deshalb ist diese Variante genauso wenig zu empfehlen wie das generische Maskulinum oder Femininum.',
                        declension: new NounDeclension({
                            N: 'derDie AutorIn', G: 'desDer AutorIn', D: 'demDer AutorIn', A: 'denDie AutorIn',
                            N_pl: 'die AutorInnen', G_pl: 'der AutorInnen', D_pl: 'den AutorInnen', A_pl: 'die AutorInnen',
                        }),
                        extendedDeclension: new NounDeclension({
                            N: 'meinE besteR FreundIn', G: 'meinesR besten FreundIn', D: 'meinemR besten FreundIn', A: 'meineN besteN FreundIn',
                            N_pl: 'meine besten FreundInnen', G_pl: 'meiner besten FreundInnen', D_pl: 'meinen besten FreundInnen', A_pl: 'meine besten FreundInnen',
                        }),
                    },
                },
            }
        },
    }
</script>
