const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [

    // months
    new Event('Mês da Visibilidade Trans (Brasil)', 'Transgender', 1, month, EventLevel.Month),
    new Event('Mês da Visibilidade Lésbica (Brasil)', 'Lesbian', 8, month, EventLevel.Month),


    // static date
    new Event('Dia da Igualdade Matrimonial (Portugal)', null, 6, day(5), EventLevel.Day),
    new Event('Dia da Igualdade Matrimonial (Brasil)', null, 5, day(16), EventLevel.Day),
    new Event('Dia Nacional da Visibilidade Trans (Brasil)', 'Transgender', 1, day(29), EventLevel.Day),
    new Event('Dia Nacional do Orgulho Gay (Brasil)', 'LGBTQ', 3, day(25), EventLevel.Day),
    new Event('Dia Nacional da Visibilidade Lésbica (Brasil)', 'Lesbian', 8, day(29), EventLevel.Day),
    new Event('Aniversário da morte de Marielle Franco', null, 3, day(14), EventLevel.Day),
    new Event('Aniversário da Nova Lei de Identidade de Género (Portugal)', null, 4, day(14), EventLevel.Day),
    new Event('Dia das Rebeliões Lésbicas', 'Lesbian_', 10, day(13), EventLevel.Day),

    // one-off events
    new Event('{https://dezanove.pt/marcha-orgulho-lgbti-leiria-marcha-a-2-1523945=1ª Marcha do Orgulho LGBTI+ de Leiria} (Portugal)', 'LGBTQ', 10, dayYear(2, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/direitos-lgbti-viseu-marcha-a-10-de-1471763=Marcha pelos Direitos LGBTI+ de Viseu} (Portugal)', 'LGBTQ', 10, dayYear(10, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/sao-joao-da-madeira-acolhe-marcha-do-1527929=1ª Marcha do Orgulho LGBTI+ em São João da Madeira} (Portugal)', 'LGBTQ', 9, dayYear(18, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/sao-joao-da-madeira-acolhe-marcha-do-1527929=2ª edição da Marcha do Orgulho LGBTI+ de Santarém} (Portugal)', 'LGBTQ', 9, dayYear(4, 2021), EventLevel.Day),
    new Event('{https://www.rea.pt/madeirapride=Madeira Pride} (Portugal)', 'LGBTQ', 10, dayYear(9, 2021), EventLevel.Day),

];
