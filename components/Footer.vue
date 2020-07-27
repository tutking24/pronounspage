<template>
    <footer>
        <Separator icon="user-friends"/>
        <section class="small text-center">
            Strona stworzona przez:
            <a href="https://twitter.com/AvrisIT" target="_blank" rel="noopener">@AvrisIT</a>
            (<nuxt-link to="/onu">onu</nuxt-link>)
            we współpracy z:
            <a href="https://twitter.com/VaultAusir" target="_blank" rel="noopener">@VaultAusir</a>
            (<nuxt-link to="/on">on</nuxt-link>)
            i
            <a href="https://gitlab.com/Avris/Zaimki" target="_blank" rel="noopener">udostępniona</a>
            na licencji
            <a href="https://mit.avris.it" target="_blank" rel="noopener">MIT</a>.
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
