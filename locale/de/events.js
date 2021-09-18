const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('{https://queerhistory.de=Queer History Month}', 'Progress Pride', 5, month, EventLevel.Month),
];
