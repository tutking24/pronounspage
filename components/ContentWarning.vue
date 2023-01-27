<template>
    <div class="alert alert-warning text-start shadow p-4">
        <p class="h4">
            <Icon v="engine-warning"/>
            <T>profile.sensitive.header</T><T>quotation.colon</T>
        </p>
        <ul>
            <li v-for="warning in warnings">{{ warning }}</li>
        </ul>
        <button v-show="dismissed" class="btn btn-outline-success w-100" @click="$emit('blur')">
            <Icon v="eye-slash"/>
            <T>profile.sensitive.hide</T>
        </button>
        <button v-show="!dismissed" class="btn btn-outline-success w-100" @click="$emit('dismiss')">
            <Icon v="check"/>
            <T>profile.sensitive.display</T>
        </button>
    </div>
</template>

<script>
export default {
    props: {
        warnings: { required: true },
        dismissed: { type: Boolean },
    },
}
</script>
