<template>
    <div>
        <Separator icon="pen-nib"/>
        <h3>Deklinationsmuster</h3>
        <p>
            Die Folgenden sind vorschläge für ein Deklinationsmuster für verschiedene Formen von geschlechtsneutralen Substantiven.
        </p>
        <div class="row">
            <div v-for="({declension, warning = null}, name) in declensions" class="col-12 col-lg-4">
                <h4>{{ name }}</h4>
                <div v-if="warning" class="alert alert-warning small">
                    <Icon v="exclamation-triangle"/>
                    {{ warning }}
                </div>
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
                    'Y-Formen': {
                        declension: new NounDeclension({
                            N: 'das Autory', G: 'des Autorys', D: 'dem Autory', A: 'das Autory',
                            N_pl: 'die Autorys', G_pl: 'der Autorys', D_pl: 'den Autorys', A_pl: 'die Autorys',
                        })
                    },
                    'Inklusivum': {
                        declension: new NounDeclension({
                            N: 'de Autore', G: 'dern Autore', D: 'dern Autore', A: 'de Autore',
                            N_pl: 'die Autorne', G_pl: 'der Autorne', D_pl: 'den Autorne', A_pl: 'die Autorne',
                        })
                    },
                    'Doppelpunkt-Formen': {
                        declension: new NounDeclension({
                            N: 'der:die Autor:in', G: 'des:der Autors:in', D: 'dem:der Autor:in', A: 'den:die Autor:in',
                            N_pl: 'die Autor:innen', G_pl: 'der Autor:innen', D_pl: 'den Autor:innen', A_pl: 'die Autor:innen',
                        })
                    },
                    'Unterstrich-Formen': {
                        declension: new NounDeclension({
                            N: 'der_die Autor_in', G: 'des_der Autors_in', D: 'dem_der Autor_in', A: 'den_die Autor_in',
                            N_pl: 'die Autor_innen', G_pl: 'der Autor_innen', D_pl: 'den Autor_innen', A_pl: 'die Autor_innen',
                        })
                    },
                    'Sternzeichen-Formen': {
                        declension: new NounDeclension({
                            N: 'der*die Autor*in', G: 'des*der Autors*in', D: 'dem*der Autor*in', A: 'den*die Autor*in',
                            N_pl: 'die Autor*innen', G_pl: 'der Autor*innen', D_pl: 'den Autor*innen', A_pl: 'die Autor*innen',
                        })
                    },
                    'Großbuchstabe-Formen': {
                        declension: new NounDeclension({
                            N: 'derDie AutorIn', G: 'desDer AutorIn', D: 'demDer AutorIn', A: 'denDie AutorIn',
                            N_pl: 'die AutorInnen', G_pl: 'der AutorInnen', D_pl: 'den AutorInnen', A_pl: 'die AutorInnen',
                        }),
                        warning: 'Das Binnen-I bezieht sich nur auf die männliche und die weibliche Form der Wörter und schließt damit (wie das generische Maskulinium) immer noch sehr viele Menschen aus der Sprache aus. Deshalb ist diese Variante genauso wenig zu empfehlen wie das generische Maskulinum oder Femininum.',
                    },
                },
            }
        },
    }
</script>
