const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [

    // static date
    new Event('Dia da Igualdade Matrimonial (Portugal)', null, 6, day(5), EventLevel.MajorDay),
    new Event('Dia da Igualdade Matrimonial (Brasil)', null, 5, day(16), EventLevel.MajorDay),
];
