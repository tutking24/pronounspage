const {Event, day, week, month, dayYear, EventLevel} = require("../../../src/calendar/helpers");

module.exports = [
    // --- months ---
    new Event('Mês da Visibilidade Trans (Brasil)', 'Transgender', 1, month, EventLevel.Month, ['transgender']),
    new Event('Mês da Visibilidade Lésbica (Brasil)', 'Lesbian', 8, month, EventLevel.Month, ['lesbian']),
    new Event('Mês da Visibilidade Assexual (Brasil)', 'Asexual', 10, month, EventLevel.Month, ['asexual', 'asexual spectrum']),
    new Event('Mes da Diversidade (Uruguay)', 'LGBTQ', 9, month, EventLevel.Month),

    // --- static date ---
    new Event('Dia da Igualdade Matrimonial (Portugal)', '_hrc', 6, day(5), EventLevel.Day),
    new Event('Dia da Igualdade Matrimonial (Brasil)', '_hrc', 5, day(16), EventLevel.Day),
    new Event('Dia Nacional da Visibilidade Trans (Brasil)', 'Transgender', 1, day(29), EventLevel.Day, ['transgender']),
    new Event('Dia Nacional do Orgulho Gay (Brasil)', 'LGBTQ', 3, day(25), EventLevel.Day, ['gay']),
    new Event('Dia Nacional da Visibilidade Lésbica (Brasil)', 'Lesbian', 8, day(29), EventLevel.Day, ['lesbian']),
    new Event('Dia Nacional do Orgulho Lésbico (Brasil)', 'Lesbian', 8, day(19), EventLevel.Day, ['lesbian']),
    new Event('Aniversário da morte de Marielle Franco', '_black-ribbon', 3, day(14), EventLevel.Day),
    new Event('Aniversário da Nova Lei de Identidade de Género (Portugal)', '_law', 4, day(14), EventLevel.Day),
    new Event('Dia das Rebeliões Lésbicas', 'Lesbian', 10, day(13), EventLevel.Day, ['lesbian']),
    new Event('Dia Latinx da Conscientização sobre Aids/Sida (EUA)', '_red-ribbon', 10, day(15), EventLevel.Day),
    new Event('Dia do Orgulho de Ser Travesti e Transexual (Brasil)', 'Transgender', 5, day(15), EventLevel.Day, ['transgender', 'travesti']),
    new Event('Dia Nacional da Afirmação Gay (Brasil)', 'LGBTQ', 2, day(28), EventLevel.Day, ['lgbtq', 'gay', 'homosexual']),
    new Event('Dia da Inclusão Social (Brasil)', null, 12, day(10), EventLevel.Day),
    new Event('Dia da Visibilidade Lésbica (Chile)', 'Lesbian', 7, day(9), EventLevel.Day, ['lesbian']),
    new Event('Dia da Visibilidade Lésbica (Argentina)', 'Lesbian', 3, day(7), EventLevel.Day, ['lesbian']),
    new Event('Dia da Visibilidade Lésbica (Paraguay)', 'Lesbian', 9, day(16), EventLevel.Day, ['lesbian']),
    new Event('Dia do Ativismo pela Diversidade Sexual (Argentina)', 'LGBTQ', 8, day(20), EventLevel.Day),
    new Event('Dia da Visibilidade das Lésbicas do Espectro Multissexual', '_mspec_lesbians', 5, day(26), EventLevel.Day, ['mspec lesbian', 'bi lesbian', 'bi gay']),
    new Event('Semana da Visibilidade das Lésbicas do Espectro Multissexual', '_mspec_lesbians', 5, weekStarting(22), EventLevel.Week, ['mspec lesbian', 'bi lesbian', 'bi gay']),


    // --- one-off events ---
    new Event('{https://dezanove.pt/marcha-orgulho-lgbti-leiria-marcha-a-2-1523945=1ª Marcha do Orgulho LGBTI+ de Leiria} (Portugal)', 'LGBTQ', 10, dayYear(2, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/direitos-lgbti-viseu-marcha-a-10-de-1471763=Marcha pelos Direitos LGBTI+ de Viseu} (Portugal)', 'LGBTQ', 10, dayYear(10, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/sao-joao-da-madeira-acolhe-marcha-do-1527929=1ª Marcha do Orgulho LGBTI+ em São João da Madeira} (Portugal)', 'LGBTQ', 9, dayYear(18, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/sao-joao-da-madeira-acolhe-marcha-do-1527929=2ª edição da Marcha do Orgulho LGBTI+ de Santarém} (Portugal)', 'LGBTQ', 9, dayYear(4, 2021), EventLevel.Day),
    new Event('{https://www.rea.pt/madeirapride=Madeira Pride} (Portugal)', 'LGBTQ', 10, dayYear(9, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/braga-mostra-as-cores-do-arco-iris-a-17-1460027=Marcha pelos Direitos LGBTI de Braga} (Portugal)', 'LGBTQ', 7, dayYear(17, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/a-2amarcha-do-orgulho-lgbt-de-barcelos-1491136=2ª Marcha do Orgulho LGBTI+ de Barcelos} (Portugal)', 'LGBTQ', 7, dayYear(10, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/a-2amarcha-do-orgulho-lgbt-de-barcelos-1491136=2ª Marcha do Orgulho LGBTI+ de Barcelos} (Portugal)', 'LGBTQ', 7, dayYear(10, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/marcha-do-orgulho-do-porto-avanca-a-3-1465870=Marcha do Orgulho LGBTI do Porto} (Portugal)', 'LGBTQ', 7, dayYear(3, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/o-primeiro-no-alentejo-beja-vai-1466394=Beja Pride} (Portugal)', 'LGBTQ', 7, dayYear(3, 2021), EventLevel.Day),
    new Event('{https://dezanove.pt/esta-vai-ser-a-primeira-marcha-do-1453592=2ª Marcha pelos Direitos LGBTI de Aveiro} (Portugal)', 'LGBTQ', 6, dayYear(12, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/805150373339790=21° Parada Da Diversidade LGBTI De Curitiba} (Brasil)', 'LGBTQ', 11, dayYear(14, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/357900524910000=25ª Parada do Orgulho LGBT de São Paulo} (Brasil)', 'LGBTQ', 6, dayYear(6, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/493723998521564/=Parada do Orgulho LGBTQIA de Mauá} (Brasil)', 'LGBTQ', 11, dayYear(28, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/384845398874612/=14° Parada do Orgulho LGBTI+ de Florianópolis} (Brasil)', 'LGBTQ', 11, dayYear(7, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/558763492035269/=4ª Parada do Orgulho LGBT+ de Santos} (Brasil)', 'LGBTQ', 10, dayYear(3, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/451121922567801/=4ª Parada do Orgulho LGBT de Rio Claro/SP} (Brasil)', 'LGBTQ', 10, dayYear(10, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/578588566271716/=1° Parada do Orgulho LGBTQIA+ de SJC} (Brasil)', 'LGBTQ', 6, dayYear(6, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1175941416231293=15ª Parada do Orgulho LGBTI+ de Itaquaquecetuba} (Brasil)', 'LGBTQ', 8, dayYear(28, 2022), EventLevel.Day),
];
