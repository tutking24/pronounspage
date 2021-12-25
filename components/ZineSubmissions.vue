<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="{icon, label, content} in $t('links.zine.submissions.rules')" class="mb-2">
                <h4>
                    <Icon :v="icon"/>
                    <LinkedText :text="label"/>:
                </h4>
                <ul v-if="Array.isArray(content)">
                    <li v-for="el in content"><LinkedText :text="el"/></li>
                </ul>
                <p v-else>
                    <LinkedText :text="content"/>
                </p>
            </li>
        </ul>

        <p class="small">
            <Icon v="info-circle"/>
            <T>links.zine.submissions.disclaimer</T>
        </p>
    </div>
</template>
