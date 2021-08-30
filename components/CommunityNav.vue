<template>
    <Submenu :links="[
        {name: 'terminology.header', icon: 'flag', route: config.terminology.route, condition: config.terminology.enabled},
                {name: 'calendar.header', route: config.calendar.route, icon: 'calendar-star', condition: config.calendar && config.calendar.enabled},
                {name: 'census.header', route: config.census.route, icon: 'user-chart', condition: config.census.enabled},
                {name: 'inclusive.header', icon: 'book-heart', route: config.inclusive.route, condition: config.inclusive.enabled},
                {name: 'people.header', route: config.people.route, icon: 'user-friends', condition: config.people.enabled},
    ]"/>
</template>
