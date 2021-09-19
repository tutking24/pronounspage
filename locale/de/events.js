const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('{https://queerhistory.de=Queer History Month}', 'Progress Pride', 5, month, EventLevel.Month),
    new Event('Jahrestag der Ehe für alle in Deutschland', null, 10, day(1), EventLevel.MajorDay),
    new Event('Jahrestag der Ehe für alle in Österreich', null, 1, day(1), EventLevel.MajorDay),
    new Event('Jahrestag der Ehe für alle in Belgien', null, 6, day(1), EventLevel.MajorDay),
    new Event('Jahrestag der Ehe für alle in Luxemburg', null, 1, day(1), EventLevel.MajorDay),

];
