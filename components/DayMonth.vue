<template>
    <div class="d-flex flex-grow-1">
        <select v-model="month" class="form-select">
            <option v-for="m in 12" :value="m"><T>calendar.months.{{m}}</T></option>
        </select>
        <select v-model="day" class="form-select">
            <option v-for="d in 31" :value="d">{{d}}</option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        value: {required: true},
    },
    data() {
        const [month, day] = this.value ? this.value.split('-') : ['1', '1'];
        return {
            month: parseInt(month),
            day: parseInt(day),
        }
    },
    watch: {
        value() {
            const [month, day] = this.value ? this.value.split('-') : ['1', '1'];
            this.month = parseInt(month);
            this.day = parseInt(day);
        },
        month() {
            this.$emit('input', `${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`)
        },
        day() {
            this.$emit('input', `${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`)
        },
    }
}
</script>
