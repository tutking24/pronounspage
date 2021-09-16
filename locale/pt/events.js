const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [

    // months
    new Event('Mês da Visibilidade Trans (Brasil)', 'Transgender', 1, month, EventLevel.Month),

    // static date
    new Event('Dia da Igualdade Matrimonial (Portugal)', null, 6, day(5), EventLevel.MajorDay),
    new Event('Dia da Igualdade Matrimonial (Brasil)', null, 5, day(16), EventLevel.MajorDay),
    new Event('Dia Nacional da Visibilidade Trans (Brasil)', 'Transgender', 1, day(29), EventLevel.MajorDay),
    new Event('Dia de Luta e Resistência de Pessoas Transmasculinas (Brasil)', 'Transmasculine', 2, day(20), EventLevel.MajorDay),
    new Event('Dia Nacional do Orgulho Gay (Brasil)', 'LGBTQ', 3, day(25), EventLevel.MajorDay),
    new Event('Dia Nacional da Visibilidade Lésbica (Brasil)', 'LGBTQ', 8, day(29), EventLevel.MajorDay),
    new Event('Aniversário da morte de Marielle Franco', null, 3, day(14), EventLevel.MajorDay),
    new Event('Aniversário da Nova Lei de Identidade de Género (Portugal)', null, 4, day(14), EventLevel.MajorDay),
];
