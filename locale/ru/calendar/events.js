const {Event, day, week, month, dayYear, EventLevel} = require("../../../src/calendar/helpers");

module.exports = [
    // --- static date ---
    new Event('Годовщина декриминализации гомосексуальности в России (1993)', '_law', 4, day(29), EventLevel.Day),
    new Event('Годовщина декриминализации гомосексуальности в Беларуси (1994)', '_law', 3, day(1), EventLevel.Day),
];
