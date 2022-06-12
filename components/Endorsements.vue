<template>
    <section v-if="config.links.endorsements && Object.keys(config.links.endorsements).length">
        <h2 class="mb-3">
            <Icon v="badge-check"/>
            <T>links.endorsements</T>
        </h2>
        <div class="row">
            <div class="col-12 col-lg-6 mb-4" v-for="(book, key) in config.links.endorsements" :key="key">
                <img :src="`/img-local/mecenat/${key}.png`" class="mw-100 shadow me-3 mb-2 float-start w-50"/>
                <h3 class="h4">
                    <a v-if="book.link" :href="book.link" target="_blank" rel="noopener">{{book.title}}</a>
                    <span v-else>{{book.title}}</span>
                </h3>
                <p class="mb-1" v-if="book.author">
                    <Icon v="user"/>
                    {{book.author}}
                </p>
                <p class="small" v-if="book.publisher">
                    <Icon v="building"/>
                    {{book.publisher}}
                </p>
                <p v-for="p in book.description" class="small">
                    <LinkedText :text="p"/>
                </p>
                <p v-if="book.review">
                    <nuxt-link :to="`/${config.links.blogRoute}/${book.review}`" class="btn btn-outline-primary btn-sm d-block">
                        <Icon v="file-check"/>
                        <T>links.review</T>
                    </nuxt-link>
                </p>
            </div>
        </div>
    </section>
</template>
