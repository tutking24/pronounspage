const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // static date
    new Event('Годовщина декриминализации гомосексуальности в России (1993)', null, 4, day(29), EventLevel.Day),
    new Event('Годовщина декриминализации гомосексуальности в беларуси (1994)', null, 3, day(1), EventLevel.Day),
];
