<template>
    <footer>
        <Separator icon="user-friends"/>
        <div class="d-flex flex-column flex-md-row justify-content-around mt-4 mb-5">
            <div class="small text-center d-flex flex-column justify-content-center">
                <p class="mb-2">
                    <T>contact.authors</T>:
                </p>

                <Authors/>

                <p>
                    <T>footer.source</T>
                </p>
            </div>
            <div class="text-center d-flex flex-column justify-content-center">
                <p class="small mb-0">
                    <Icon v="users"/>
                    <T>footer.links</T>:
                </p>
                <div class="mb-3">
                    <SquareButton
                            v-for="link in [...config.contact.contacts, ...config.links.socials]" :key="link.url"
                            :link="link.url">
                        <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                    </SquareButton>
                    <br/>
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
                <Share/>
            </div>
        </div>
    </footer>
</template>
