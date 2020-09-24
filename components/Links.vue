<template>
    <section :class="{'mt-0': top}">
        <h2 class="mb-3">
            <Icon v="bookmark"/>
            Dodatkowe materiały
        </h2>
        <ul class="list-unstyled">
            <li class="my-2">
                <Icon v="globe-europe"/>
                <a href="https://pronoun.is/" target="_blank" rel="noopener">
                    Pronoun.is
                </a>
                – anglojęzyczna inspiracja dla tej strony.
            </li>
            <li class="my-2">
                <Icon v="comment-alt-edit"/>
                <a href="https://avris.it/blog/czemu-ka%C5%BCdy-powinien-mie%C4%87-zaimki-w-bio" target="_blank" rel="noopener">
                    Czemu KAŻDY powinien mieć zaimki w bio
                </a>
            </li>
            <li class="my-2">
                <Icon v="comment-alt-edit"/>
                <a href="https://avris.it/blog/genderneutralizacja-polszczyzny" target="_blank" rel="noopener">
                    Genderneutralizacja polszczyzny?
                </a>
                – artykuł opisujący, dlaczego język neutralny płciowo jest ważny,
                i zbierający pomysły na stworzenie takiego.
            </li>
            <li class="my-2">
                <Icon v="comment-alt-edit"/>
                <a href="https://www.przemyslenia-maniaka.pl/2019/11/maniak-marudzi-27-niebinarne-tumaczenia.html" target="_blank" rel="noopener">
                    Maniak marudzi #27: Niebinarne tłumaczenia
                </a>
                – artykuł pokazujący, że „nie da się przetłumaczyć they/them na polski” to tylko wymówka.
            </li>
            <li class="my-2">
                <Icon v="comment-alt-edit"/>
                <a href="http://wasowska.net/2020/09/rowni-wobec-jezyka-o-jezyku-neutralnym-plciowo/" target="_blank" rel="noopener">
                    Równi wobec języka – o języku neutralnym płciowo
                </a>
                – artykuł Agnieszki Wąsowskiej
            </li>
            <li class="my-2">
                <Icon v="play-circle"/>
                <a href="https://www.youtube.com/watch?v=YOEB6Ixp048" target="_blank" rel="noopener">
                    Nie-binarny język polski – seminarium naukowe (Queer UW)
                </a>
            </li>
            <li class="my-2">
                <Icon v="play-circle"/>
                <a href="https://rss.com/podcasts/bezwstydny/75056/" target="_blank" rel="noopener">
                    Niebinarność, neutratywy i prawa człowieka – Rozmowa z W. Dynarskim (Bezwstydne Podcast)
                </a>
                – <span class="text-nowrap">o zaimki.pl</span> i neutratywach w okolicach 13:40
            </li>
            <li class="my-2">
                <Icon v="instagram" set="b"/>
                <a href="https://www.instagram.com/inkluzywnamowa/" target="_blank" rel="noopener">
                    @inkluzywnamowa na Instagramie
                </a>
            </li>
            <li class="my-2">
                <Icon v="facebook" set="b"/>
                <a href="https://facebook.com/slownikempatyczny" target="_blank" rel="noopener">
                    „Słownik Empatyczny Języka Polskiego” na Facebooku
                </a>
            </li>
        </ul>
    </section>
</template>

<script>
    export default {
        props: {
            top: { type: Boolean },
        }
    };
</script>
