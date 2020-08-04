<template>
    <footer>
        <Separator icon="user-friends"/>
        <section class="small text-center">
            <p>
                Autorza strony:

                Andrea
                (<nuxt-link to="/onu">onu</nuxt-link>,
                <a href="https://avris.it" target="_blank" rel="noopener"><Icon v="globe"/></a>,
                <a href="https://twitter.com/AvrisIT" target="_blank" rel="noopener"><Icon v="twitter" set="b"/></a>,
                <a href="mailto:andrea@avris.it" target="_blank" rel="noopener"><Icon v="envelope"/></a>),

                Paweł Dembowski
                (<nuxt-link to="/on">on</nuxt-link>,
                <a href="https://twitter.com/VaultAusir" target="_blank" rel="noopener"><Icon v="twitter" set="b"/></a>,
                <a href="mailto:pawel.dembowski@gmail.com" target="_blank" rel="noopener"><Icon v="envelope"/></a>),

                Sybilla Mykofanes
                (<nuxt-link to="/ona&ono">ona/ono</nuxt-link>).
            </p>

            <p>
                Kod jest
                <a href="https://gitlab.com/Avris/Zaimki" target="_blank" rel="noopener">udostępniony</a>
                na licencji
                <a href="https://mit.avris.it" target="_blank" rel="noopener">MIT</a>.
            </p>
        </section>
        <section class="text-center small">
            <Share/>
            <div class="mt-2">
                <SquareButton link="https://avris.it">
                    <img src="~assets/avris.svg"/>
                </SquareButton>
                <SquareButton link="https://paypal.me/AndreAvris">
                    <Icon v="paypal" set="b"/>
                </SquareButton>
                <SquareButton link="https://gitlab.com/Avris/Zaimki">
                    <Icon v="gitlab" set="b"/>
                </SquareButton>
            </div>
        </section>
    </footer>
</template>
