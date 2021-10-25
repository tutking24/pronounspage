<template>
    <LazyHydrate when-visible>
    <div>
        <div class="d-flex justify-content-between">
            <h3>{{ name.name }}</h3>
            <slot></slot>
        </div>
        <div class="d-flex flex-column flex-md-row">
            <ul class="list-unstyled w-md-50">
                <li v-if="name.origin" class="mb-2">
                    <Icon v="map-marked-alt"/>
                    <strong><T>names.origin</T>:</strong>
                    {{ name.origin }}
                </li>
                <li v-if="name.meaning" class="mb-2">
                    <Icon v="comment-exclamation"/>
                    <strong><T>names.meaning</T>:</strong>
                    <LinkedText :text="name.meaning"/>
                </li>
                <li v-if="name.usage" class="mb-2">
                    <Icon v="user-friends"/>
                    <strong><T>names.usage</T>:</strong>
                    {{ name.usage }}
                </li>
                <li v-if="config.names.legally && name.legally" class="mb-2">
                    <Icon v="file-contract"/>
                    <strong><T>names.legally</T>:</strong>
                    {{ name.legally }}
                </li>
                <li v-if="config.names.count" class="mb-2">
                    <Icon v="users"/>
                    <strong><T>names.count</T>:</strong>
                    <NameCount :name="name.name"/>
                </li>
                <li v-if="config.names.namedays && name.namedays.length">
                    <Icon v="glass-cheers"/>
                    <strong><T>names.namedays</T>:</strong>
                    {{ namedaysString(name) }}
                    <p class="small" v-if="name.namedaysComment">(<LinkedText :text="name.namedaysComment"/>)</p>
                </li>
            </ul>
            <ul class="list-unstyled w-md-50">
                <li v-for="pro in name.pros" class="mb-2">
                    <Icon v="plus-circle"/>
                    <LinkedText :text="pro"/>
                </li>
                <li v-for="con in name.cons" class="mb-2">
                    <Icon v="minus-circle"/>
                    <LinkedText :text="con"/>
                </li>
                <li v-for="person in name.notablePeople" class="mb-2">
                    <Icon v="user"/>
                    <LinkedText :text="person"/>
                </li>
                <li v-for="link in name.links" class="mb-2">
                    <Icon v="external-link"/>
                    <a :href="link.trim()" target="_blank" rel="noopener">{{ clearUrl(link) }}</a>
                </li>
            </ul>
        </div>
    </div>
    </LazyHydrate>
</template>

<script>
import {clearUrl} from '~/src/helpers';
import LazyHydrate from 'vue-lazy-hydration';

export default {
    components: { LazyHydrate },
    props: {
        name: {required: true},
    },
    data() {
        return {
            clearUrl,
        }
    },
    methods: {
        namedaysString(name) {
            if (!name.namedays.length) { return ''; }

            const days = name.namedays.map(d => {
                const [month, day] = d.split('-');
                return this.$t('calendar.dates.' + parseInt(month), {day: parseInt(day)});
            })

            return days.join(', ')
        },
    },
}
</script>
