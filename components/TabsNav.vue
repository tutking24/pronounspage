<template>
    <div>
        <ul :class="['nav', pills ? 'nav-pills' : 'nav-tabs', navclass]">
            <li v-for="tab in visibleTabs" class="nav-item">
                <a :class="['nav-link', activeTab === tab ? 'active' : '']" :aria-current="activeTab === tab ? 'page' : ''" href="#"
                    @click.prevent="activeTab = tab">
                    <slot :name="`${tab}-header`"></slot>
                </a>
            </li>
        </ul>
        <div class="card">
            <div v-for="tab in visibleTabs" :class="['card-body', activeTab === tab ? 'd-block' : 'd-none']">
                <h3 v-if="showheaders" class="h4 mb-3">
                    <slot :name="`${tab}-header`"></slot>
                </h3>
                <slot :name="tab"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tabs: { required: true },
        active: {},
        pills: { type: Boolean },
        showheaders: { type: Boolean },
        navclass: { default: 'nav-tabs' },
    },
    data() {
        return {
            visibleTabs: this.tabs.filter(x => x !== undefined),
            activeTab: this.active || this.tabs[0],
        }
    }
};
</script>
