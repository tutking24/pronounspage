const { Day, Calendar, Event, EventLevel, day } = require('./helpers');
const internationalEvents = require('../../locale/_/events');
const localEvents = require('../../data/events');

const rawNamedays = require('../../data/names/namedays.json');

const namedays = [];
for (let name in rawNamedays) {
    if (!rawNamedays.hasOwnProperty(name)) { continue; }
    for (let nd of rawNamedays[name]) {
        const [m, d] = nd.split('-');
        namedays.push(new Event('nameday$'+name, null, parseInt(m), day(parseInt(d)), EventLevel.Nameday));
    }
}

module.exports.currentYear = new Calendar(
    Day.today().year,
    [...internationalEvents, ...localEvents], // TODO , ...namedays
);
