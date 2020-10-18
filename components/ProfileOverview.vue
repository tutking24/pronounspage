<template>
    <div class="d-flex justify-content-between align-items-center">
        {{ locales[locale].name }}
        <span v-if="profile">
            <LocaleLink :locale="locale" :link="`/@${profile.username}`" class="badge badge-primary">
                <Icon v="id-card"/>
                <T>profile.show</T>
            </LocaleLink>
            <LocaleLink :locale="locale" link="/TODO" class="badge badge-light border">
                <Icon v="edit"/>
                <T>profile.edit</T>
            </LocaleLink>
            <LocaleLink :locale="locale" link="/TODOS" class="badge badge-light">
                <Icon v="trash-alt"/>
            </LocaleLink>
        </span>
        <span v-else>
            <LocaleLink :locale="locale" link="/TODO" class="badge badge-light border">
                <Icon v="plus-circle"/>
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
