const {Event, day, week, month, dayYear, EventLevel, Day} = require("../../../src/calendar/helpers");

module.exports = [

    // --- months ---
    new Event('{https://www.queergeschiedenismaand.nl/=Queer Geschiedenismaand}', 'Progress Pride', 2, month, EventLevel.Month, [], null, null, y => [2021, 2022].includes(y)),
    new Event('{https://www.queergeschiedenismaand.nl/=Queer Geschiedenismaand}', 'Progress Pride', 3, month, EventLevel.Month, [], null, null, y => y >= 2023),

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
