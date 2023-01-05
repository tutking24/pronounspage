import {DateTime, IANAZone} from "luxon";

const CONTINENT_ICONS = {
    'Africa': 'globe-africa',
    'America': 'globe-americas',
    'Antarctica': 'globe',
    'Arctic': 'globe',
    'Asia': 'globe-asia',
    'Atlantic': 'globe-americas',
    'Australia': 'globe-asia',
    'Europe': 'globe-europe',
    'Indian': 'globe-asia',
    'Pacific': 'globe-asia',
}

const timezoneOverrides = {
    'Europe/Kiev': 'Europe/Kyiv',
};

export default {
    methods: {
        detectBrowserTimezone() {
            return DateTime.local().zone.name;
        },
        getTimezoneInfo(timezone) {
            const parts = timezone.split('/');
            const displayParts = this.timezoneDisplayName(timezone).split('/');
            const area = parts[0];
            const location = parts[parts.length - 1].replace(/_/g, ' ');
            const displayLocation = displayParts[parts.length - 1].replace(/_/g, ' ');
            const tz = new IANAZone(timezone);
            const dt = DateTime.local().setZone(tz);

            return {
                timezone,
                area,
                location,
                displayLocation,
                icon: CONTINENT_ICONS[area],
                offset: dt.offset,
                offsetFormatted: tz.formatOffset(dt.ts, 'short'),
                short: dt.offsetNameShort,
                long: dt.offsetNameLong,
            };
        },
        timezoneDisplayName(tz) {
            return timezoneOverrides[tz] || tz;
        },
    }
}
