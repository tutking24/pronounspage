const { Calendar, Event, EventLevel, day } = require('./helpers');
const internationalEvents = require('../../locale/_/calendar/events');
// const locale = $zRouterData().locale;
// TODO(96): fix this
const localEvents = require(`../../locale/en/calendar/events`);

const rawNamedays = require(`../../locale/en/names/namedays.json`);

const namedays = [];
for (let name in rawNamedays) {
    if (!rawNamedays.hasOwnProperty(name)) { continue; }
    for (let nd of rawNamedays[name]) {
        const [m, d] = nd.split('-');
        namedays.push(new Event('nameday$'+name, null, parseInt(m), day(parseInt(d)), EventLevel.Nameday));
    }
}

module.exports.calendar = new Calendar(
    [...internationalEvents, ...localEvents], // TODO , ...namedays
    2021,
    2022,
);
