<template>
    <span><span v-if="inline"> — </span><br v-else/>{{heDate.toLocaleDateString('en-US-u-ca-hebrew', {
        month: 'long',
        year: 'numeric',
        day: '2-digit'
    })}}</span>
</template>

<script>
import HeDate from 'he-date';

export default {
    props: {
        day: { required: true },
        inline: { type: Boolean },
    },
    computed: {
        heDate() {
            const HeDateClass = typeof(HeDate) === 'function' ? HeDate : window.HeDate;
            console.log(HeDateClass);
            // return 'TODO';
            return new HeDateClass(+this.day.toDate());
        },
    },
};
</script>
