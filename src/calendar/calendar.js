const { Day, Calendar } = require('./helpers');
const internationalEvents = require('../../locale/_/events');
const localEvents = require('../../data/events');

module.exports.currentYear = new Calendar(
    Day.today().year,
    [...internationalEvents, ...localEvents],
);
