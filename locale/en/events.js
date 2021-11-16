const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('LGBT History Month (UK/Hungary/Netherlands)', 'Progress Pride', 2, month, EventLevel.Month),
    new Event('LGBT History Month (US/Canada/Australia)', 'Progress Pride', 10, month, EventLevel.Month),
    new Event('LGBT History Month (Ireland/Germany)', 'Progress Pride', 5, month, EventLevel.Month),
    new Event('{/terminology#transgender=Trans} Visibility Month (Brazil)', 'Transgender', 1, month, EventLevel.Month, ['transgender']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Month (Brazil)', 'Lesbian', 8, month, EventLevel.Month, ['lesbian']),
    new Event('Diversity Month (Uruguay)', 'LGBTQ', 9, month, EventLevel.Month),
    new Event('{/terminology#asexual=Asexual} Visibility Month (Brazil)', 'Asexual', 10, month, EventLevel.Month, ['asexual', 'asexual spectrum']),
    new Event('{/terminology#transgender=Transgender} History Month (US)', 'Transgender', 8, month, EventLevel.Month, ['transgender']),

    // static date
    new Event('Harvey Milk Day', null, 5, day(22), EventLevel.Day),
    new Event('Pink Triangle Day (Canada)', null, 2, day(14), EventLevel.Day),
    new Event('Marriage Equality Day (US)', null, 6, day(26), EventLevel.Day),
    new Event('Marriage Equality Day (England and Wales)', null, 3, day(13), EventLevel.Day),
    new Event('Marriage Equality Day (Scotland)', null, 12, day(16), EventLevel.Day),
    new Event('Marriage Equality Day (Northern Ireland)', null, 1, day(13), EventLevel.Day),
    new Event('Marriage Equality Day (Canada)', null, 7, day(20), EventLevel.Day),
    new Event('Marriage Equality Day (Australia)', null, 12, day(9), EventLevel.Day),
    new Event('Marriage Equality Day (New Zealand)', null, 8, day(19), EventLevel.Day),
    new Event('Marriage Referendum Anniversary (Ireland)', null, 5, day(22), EventLevel.Day),
    new Event('Freedom to Marry Day (US)', null, 2, day(12), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nthtd.html=Transgender HIV Testing Day} (US)', 'Transgender', 4, day(18), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/testingday.html=HIV Testing Day} (US/Canada)', null, 6, day(27), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nbhaad.html=Black HIV Testing Day} (US/Canada)', null, 2, day(7), EventLevel.Day),
    new Event('Anniversary of the Decriminalisation of Homosexuality in England and Wales (1967)', null, 7, day(27), EventLevel.Day),
    new Event('Anniversary of the Decriminalisation of Homosexuality in Scotland (1981)', null, 2, day(1), EventLevel.Day),
    new Event('{/terminology#two%20spirit=Two Spirit} Awareness Day', 'Two Spirit', 7, day(11), EventLevel.Day, ['two spirit']),
    new Event('{https://www.cdc.gov/hiv/library/awareness/ngmhaad.html=Gay Men\'s HIV/AIDS Awareness Day} (US)', null, 9, day(27), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nhaad.html=HIV/AIDS and Aging Awareness Day} (US/Canada)', null, 9, day(18), EventLevel.Day),
    new Event('LGBT Center Awareness Day (US)', null, 10, day(19), EventLevel.Day),
    new Event('{https://twitter.com/_EQUALGROUND_/status/1440232964286124050=Lesbian Visibility Day} (Sri Lanka)', 'Lesbian', 9, day(21), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nlaad.html=Latinx AIDS Awareness Day} (US)', null, 10, day(15), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/shaad.html=Southern HIV/AIDS Awareness Day} (US)', null, 8, day(20), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/napihaad.html=Asian and Pacific Islander HIV/AIDS Awareness Day} (US)', null, 5, day(19), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nyhaad.html=Youth HIV/AIDS Awareness Day} (US)', null, 4, day(10), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nwghaad.html=Women and Girls HIV/AIDS Awareness Day} (US)', null, 3, day(10), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nnhaad.html=Native HIV/AIDS Awareness Day} (US)', null, 3, day(20), EventLevel.Day),
    new Event('{https://www.hiv.gov/events/awareness-days/hiv-long-term-survivors-day=HIV Long-Term Survivors Awareness Day} (US)', null, 6, day(5), EventLevel.Day),
    new Event('{/terminology#transgender=Trans} Visibility Day (Brazil)', 'Transgender', 1, day(29), EventLevel.Day, ['transgender']),
    new Event('National {/terminology#pride=Gay Pride} Day (Brazil)', 'LGBTQ', 3, day(25), EventLevel.Day),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Brazil)', 'Lesbian', 8, day(29), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Rebelliousness Day (Latin America)', 'Lesbian_', 10, day(13), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Chile)', 'Lesbian', 7, day(9), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Argentina)', 'Lesbian', 3, day(7), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Paraguay)', 'Lesbian', 9, day(16), EventLevel.Day, ['lesbian']),
    new Event('Day of Activism for Sexual Diversity (Argentina)', 'LGBTQ', 8, day(20), EventLevel.Day),
    new Event('{/terminology#transgender=Trans} Rights Day (Argentina)', 'Transgender', 3, day(18), EventLevel.Day, ['transgender']),
    new Event('{/terminology#nonbinary=Nonbinary} People\'s Day (Poland)', 'Nonbinary', 3, day(9), EventLevel.Day, ['nonbinary']),
    new Event('{https://en.wikipedia.org/wiki/Matthew_Shepard=Matthew Shepard} Day of Remembrance', null, 10, day(12), EventLevel.Day),
    new Event('{/terminology#transgender=Trans-}, {/terminology#travesti=Travesti} and {{/terminology#nonbinary=Non-Binary} Visibility Day (Paraguay)', 'Transgender', 10, day(15), EventLevel.Day, ['transgender', 'nonbinary', 'travesti']),
    new Event('Missing and Murdered Indigenous Women, Girls, and {/terminology#two%20spirit=Two Spirit} Awareness Day', 'Two Spirit', 5, day(5), EventLevel.Day, ['two spirit']),
    

    // dynamic date
    new Event('Wear it Purple Day (Australia)', null, 8, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    new Event('Spirit Day', null, 10, function* (monthDays) {
        let thursdays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 4) {
                thursdays++;
                if (thursdays === 3) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day),

    new Event('Purple Friday (UK)', null, 2, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    new Event('Rainbow Friday (Poland)', null, 10, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    new Event('Purple Friday (Netherlands)', null, 12, function* (monthDays) {
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

    // one-off events
    new Event('Day of Silence', null, 4, dayYear(23, 2021), EventLevel.Day),
    new Event('LGBTQIA+ Equal Pay Awareness Day', null, 6, dayYear(16, 2021), EventLevel.Day),

];
