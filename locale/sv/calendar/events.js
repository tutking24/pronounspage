const {Event, day, week, month, dayYear, EventLevel, Day} = require("../../../src/calendar/helpers");

module.exports = [
    // --- months ---
    new Event('Queer History Month (Finland)', 'Progress Pride', 11, month, EventLevel.Month),    


    // --- static date ---
    new Event('Marriage Equality Day (Sweden)', '_hrc', 5, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Finland)', '_hrc', 3, day(1), EventLevel.Day),

];
