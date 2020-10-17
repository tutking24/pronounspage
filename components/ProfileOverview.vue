<template>
    <div class="d-flex justify-content-between align-items-center">
        {{ locales[locale].name }}
        <span v-if="profile">
            <LocaleLink :locale="locale" :link="`/@${profile.username}`" class="badge badge-primary">
                <T>profile.show</T>
            </LocaleLink>
            <LocaleLink :locale="locale" link="/TODO" class="badge badge-light border">
                <T>profile.edit</T>
            </LocaleLink>
            <LocaleLink :locale="locale" link="/TODOS" class="badge badge-light border border-danger">
                <T>profile.delete</T>
            </LocaleLink>
        </span>
        <span v-else>
            <LocaleLink :locale="locale" link="/TODO" class="badge badge-light border">
                <T>profile.init</T>
            </LocaleLink>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            profile: { required: true },
            locale: { required: true },
        }
    }
</script>
