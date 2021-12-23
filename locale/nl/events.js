const {Event, day, week, month, dayYear, EventLevel, Day} = require("../../src/calendar/helpers");

module.exports = [

    // --- months ---
    new Event('LHBT-geschiedenismaand', 'Progress Pride', 2, month, EventLevel.Month),

    // --- static date ---
    new Event('Marriage Equality Day (Nederland)', '_hrc', 4, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (België)', '_hrc', 6, day(1), EventLevel.Day),

    // --- dynamic date ---

    // second Friday of December
    new Event('Paarse Vrijdag (Nederland)', null, 12, function* (monthDays) {
        let fridays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                fridays++;
                if (fridays === 2) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day),

];
