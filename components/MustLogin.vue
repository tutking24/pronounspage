<template>
    <div>
        <h2>
            <Icon v="shield"/>
            <T>authRequired.message</T>
        </h2>

        <p class="h4 mt-4">
            <nuxt-link :to="'/' + config.user.route">
                <Icon v="sign-in"/>
                <T>authRequired.go</T>
            </nuxt-link>
        </p>
    </div>
</template>
