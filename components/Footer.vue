<template>
    <footer>
        <Separator icon="user-friends"/>
        <div class="d-flex flex-column flex-md-row justify-content-around mt-4 mb-5">
            <div class="small text-center d-flex flex-column justify-content-center">
                <p class="mb-2">
                    <nuxt-link to="/neutratywy#autor">Autorza</nuxt-link> strony:
                </p>

                <ul class="list-unstyled">
                    <li>
                        Andrea
                        (<nuxt-link to="/onu">onu</nuxt-link>,
                        <a href="https://avris.it" target="_blank" rel="noopener"><Icon v="globe"/></a>,
                        <a href="https://twitter.com/AvrisIT" target="_blank" rel="noopener"><Icon v="twitter" set="b"/></a>,
                        <a href="mailto:andrea@avris.it" target="_blank" rel="noopener"><Icon v="envelope"/></a>)
                        – <a href="https://gitlab.com/Avris/Zaimki" target="_blank" rel="noopener">kod</a>, język
                    </li>

                    <li>
                        Paweł Dembowski
                        (<nuxt-link to="/on">on</nuxt-link>,
                        <a href="https://twitter.com/VaultAusir" target="_blank" rel="noopener"><Icon v="twitter" set="b"/></a>,
                        <a href="mailto:pawel.dembowski@gmail.com" target="_blank" rel="noopener"><Icon v="envelope"/></a>)
                        – język, <nuxt-link to="/literatura">literatura</nuxt-link>
                    </li>

                    <li>
                        Zuzanna Sybilla Grzybowska
                        (<nuxt-link to="/ona&ono/jej">ona/ono</nuxt-link>,
                        <a href="https://twitter.com/mykofanes" target="_blank" rel="noopener"><Icon v="twitter" set="b"/></a>,
                        <a href="mailto:zuzannagrzybowska@protonmail.com" target="_blank" rel="noopener"><Icon v="envelope"/></a>)
                        – <nuxt-link to="/neutratywy">neutratywy</nuxt-link>
                    </li>
                </ul>

                <p class="mb-0">
                    Kod jest
                    <a href="https://gitlab.com/Avris/Zaimki" target="_blank" rel="noopener">udostępniony</a>
                    na licencji
                    <a href="https://mit.avris.it" target="_blank" rel="noopener">MIT</a>.
                </p>
            </div>
            <div class="text-center">
                <p class="small mb-0">
                    <Icon v="users"/>
                    Kontakt, social media, wsparcie:
                </p>
                <div class="mb-3">
                    <SquareButton link="https://avris.it">
                        <img src="~assets/avris.svg"/>
                    </SquareButton>
                    <SquareButton link="https://facebook.com/neutratywy/">
                        <Icon v="facebook-f" set="b"/>
                    </SquareButton>
                    <SquareButton link="https://instagram.com/neutratywy/">
                        <Icon v="instagram" set="b"/>
                    </SquareButton>
                    <SquareButton link="https://paypal.me/AndreAvris">
                        <Icon v="paypal" set="b"/>
                    </SquareButton>
                    <SquareButton link="https://gitlab.com/Avris/Zaimki">
                        <Icon v="gitlab" set="b"/>
                    </SquareButton>
                </div>
                <Share/>
            </div>
        </div>
    </footer>
</template>
