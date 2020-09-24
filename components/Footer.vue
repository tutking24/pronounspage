<template>
    <footer>
        <Separator icon="user-friends"/>
        <div class="d-flex flex-column flex-md-row justify-content-around mt-4 mb-5">
            <div class="small text-center d-flex flex-column justify-content-center">
                <p class="mb-2">
                    <nuxt-link to="/neutratywy#autorzę">Autorza</nuxt-link> strony:
                </p>

                <Authors/>

                <p class="mb-0">
                    Kod jest
                    <a href="https://gitlab.com/Avris/Zaimki" target="_blank" rel="noopener">udostępniony</a>
                    na licencji
                    <a href="https://mit.avris.it" target="_blank" rel="noopener">MIT</a>.
                </p>
            </div>
            <div class="text-center d-flex flex-column justify-content-center">
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
