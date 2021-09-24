const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('LGBT History Month (UK/Hungary/Netherlands)', 'Progress Pride', 2, month, EventLevel.Month),
    new Event('LGBT History Month (US/Canada/Australia)', 'Progress Pride', 10, month, EventLevel.Month),
    new Event('LGBT History Month (Ireland/Germany)', 'Progress Pride', 5, month, EventLevel.Month),

    // static date
    new Event('Harvey Milk Day', null, 5, day(22), EventLevel.MajorDay),
    new Event('Pink Triangle Day (Canada)', null, 2, day(14), EventLevel.MajorDay),
    new Event('Marriage Equality Day (US)', null, 6, day(26), EventLevel.MajorDay),
    new Event('Marriage Equality Day (England and Wales)', null, 3, day(13), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Scotland)', null, 12, day(16), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Northern Ireland)', null, 1, day(13), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Canada)', null, 7, day(20), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Australia)', null, 12, day(9), EventLevel.MajorDay),
    new Event('Marriage Equality Day (New Zealand)', null, 8, day(19), EventLevel.MajorDay),
    new Event('Marriage Referendum Anniversary (Ireland)', null, 5, day(22), EventLevel.MajorDay),
    new Event('National Freedom to Marry Day (US)', null, 2, day(12), EventLevel.MajorDay),
    new Event('National Transgender HIV Testing Day (US)', 'Transgender', 4, day(18), EventLevel.MajorDay),
    new Event('National HIV Testing Day (US)', null, 6, day(27), EventLevel.MajorDay),
    new Event('National Black HIV Testing Day (US)', null, 2, day(7), EventLevel.MajorDay),
    new Event('Anniversary of the Decriminalisation of Homosexuality in England and Wales (1967)', null, 7, day(27), EventLevel.MajorDay),
    new Event('Anniversary of the Decriminalisation of Homosexuality in Scotland (1981)', null, 2, day(1), EventLevel.MajorDay),
    new Event('Two Spirit Awareness Day', 'Two Spirit', 7, day(11), EventLevel.MajorDay),
    new Event('National Gay Men\'s HIV/AIDS Awareness Day (US)', null, 9, day(27), EventLevel.MajorDay),
    new Event('National HIV/AIDS and Aging Awareness Day (US)', null, 9, day(18), EventLevel.MajorDay),
    new Event('LGBT Center Awareness Day (US)', null, 10, day(19), EventLevel.MajorDay),
    new Event('{https://twitter.com/_EQUALGROUND_/status/1440232964286124050=Lesbian Visibility Day} (Sri Lanka)', 'Lesbian', 9, day(21), EventLevel.MajorDay),
    new Event('National Latinx AIDS Awareness Day (US)', null, 10, day(15), EventLevel.MajorDay),
    new Event('Southern HIV/AIDS Awareness Day (US)', null, 8, day(20), EventLevel.MajorDay),
    new Event('National Asian and Pacific Islander HIV/AIDS Awareness Day (US)', null, 5, day(19), EventLevel.MajorDay),
    new Event('National Youth HIV/AIDS Awareness Day (US)', null, 4, day(10), EventLevel.MajorDay),
    new Event('National Women and Girls HIV/AIDS Awareness Day (US)', null, 3, day(10), EventLevel.MajorDay),
    new Event('National Native HIV/AIDS Awareness Day (US)', null, 3, day(20), EventLevel.MajorDay),
    new Event('HIV Long-Term Survivors Awareness Day (US)', null, 6, day(5), EventLevel.MajorDay),

    // dynamic date
    new Event('Wear it Purple Day (Australia)', null, 8, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.MajorDay),

    new Event('Spirit Day', null, 10, function* (monthDays) {
        let fridays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                fridays++;
                if (fridays === 3) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.MajorDay),

    // one-off events
    new Event('Day of Silence', null, 4, dayYear(23, 2021), EventLevel.MajorDay),
    new Event('LGBTQIA+ Equal Pay Awareness Day', null, 6, dayYear(16, 2021), EventLevel.MajorDay),

];
