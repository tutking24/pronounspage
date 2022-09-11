<template>
    <div class="list-group list-group-flare">
        <div class="list-group-item pt-3">
            <h5>
                <Icon v="share"/>
                <T>share</T>
            </h5>
        </div>
        <div class="list-group-item small p-2 text-center">
            <Share nolabel shareApiSeparate/>
        </div>
        <a v-if="!showQr" href="#" class="list-group-item list-group-item-action list-group-item-hoverable" @click.prevent="showQr = true">
            <Icon v="scanner"/>
            <T>user.qr.header</T>
        </a>
        <div v-else class="list-group-item small p-2 text-center">
            <QrCode v-if="showQr"
                    :url="`https://${$t('domain')}/@${user.username}`"
                    :text1="$t('domain')" :text2="`@${user.username}`"
                    download border
                    style="max-width: 256px; margin: 0 auto"/>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: { required: true },
        showQrStart: { type: Boolean },
    },
    data() {
        return {
            showQr: this.showQrStart,
        }
    },
}
</script>
