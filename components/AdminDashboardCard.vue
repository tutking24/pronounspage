<template>
    <div class="col-12 col-lg-4">
        <component :is="link ? 'a' : 'div'" :href="(baseUrl || '') + link" class="card mb-3" style="min-height: 164px;">
            <div class="card-body text-center d-flex align-items-center">
                <div class="w-100">
                    <h4>
                        <Icon :v="icon"/>
                        {{ header }}
                    </h4>
                    <ul class="list-inline h5">
                        <li v-for="{name, count, warning, danger, link} in counts || []" class="list-inline-item">
                            <component :is="link ? 'a' : 'span'"
                                       :href="(baseUrl || '') + link"
                                       :class="['badge', counterClass(count, warning, danger)]">
                                {{ count }} {{name || ''}}
                            </component>
                        </li>
                    </ul>
                    <slot></slot>
                </div>
            </div>
        </component>
    </div>
</template>

<script>
export default {
    props: {
        baseUrl: { required: false },
        icon: { required: true },
        header: { required: true },
        link: { required: false },
        counts: { required: false },
    },
    methods: {
        counterClass(count, warning, danger) {
            if (danger && count >= danger) {
                return 'bg-danger';
            }
            if (warning && count >= warning) {
                return 'bg-warning';
            }
            return 'bg-light text-dark border';
        }
    },
};
</script>
