const { Calendar, Event, EventLevel, day } = require('./helpers');
const internationalEvents = require('../../locale/_/calendar/events');
const localEvents = require('../../data/calendar/events');

const rawNamedays = require('../../data/names/namedays.json');

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
