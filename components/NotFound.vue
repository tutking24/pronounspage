<template>
    <div>
        <h2>
            <Icon v="person-dolly-empty"/>
            <T>notFound.message</T>
        </h2>

        <p class="h4 mt-4">
            <nuxt-link to="/">
                <Icon v="chevron-circle-left"/>
                <T>notFound.back</T>
            </nuxt-link>
        </p>

        <AdPlaceholder phkey="main-0"/>
    </div>
</template>
