const {Event, NepaliEvent, day, week, month, dayYear, weekStarting, EventLevel, Day} = require("../../../src/calendar/helpers");

module.exports = [
    // --- months ---
    new Event('LGBTQ+ History Month (UK/Hungary/Netherlands)', 'Progress Pride', 2, month, EventLevel.Month),
    new Event('LGBTQ+ History Month (US/Canada/Australia)', 'Progress Pride', 10, month, EventLevel.Month),
    new Event('LGBTQ+ History Month (Italy)', 'Progress Pride', 4, month, EventLevel.Month),
    new Event('LGBTQ+ History Month (Cuba/Germany)', 'Progress Pride', 5, month, EventLevel.Month),
    new Event('Queer History Month (Finland)', 'Progress Pride', 11, month, EventLevel.Month),
    new Event('{/terminology#transgender=Trans} Visibility Month (Brazil)', 'Transgender', 1, month, EventLevel.Month, ['transgender']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Month (Brazil)', 'Lesbian', 8, month, EventLevel.Month, ['lesbian']),
    new Event('Diversity Month (Uruguay)', 'LGBTQ', 9, month, EventLevel.Month),
    new Event('{/terminology#asexual=Asexual} Visibility Month (Brazil)', 'Asexual', 10, month, EventLevel.Month, ['asexual', 'asexual spectrum']),
    new Event('{/terminology#transgender=Transgender} History Month (US)', 'Transgender', 8, month, EventLevel.Month, ['transgender']),

    // --- static date ---
    new Event('Harvey Milk Day', null, 5, day(22), EventLevel.Day),
    new Event('{/terminology#pink%20triangle=Pink Triangle} Day (Canada)', null, 2, day(14), EventLevel.Day, ['pink triangle']),
    new Event('Marriage Equality Day (US)', '_hrc', 6, day(26), EventLevel.Day),
    new Event('Marriage Equality Day (England and Wales)', '_hrc', 3, day(13), EventLevel.Day),
    new Event('Marriage Equality Day (Scotland)', '_hrc', 12, day(16), EventLevel.Day),
    new Event('Marriage Equality Day (Northern Ireland)', '_hrc', 1, day(13), EventLevel.Day),
    new Event('Marriage Equality Day (Canada)', '_hrc', 7, day(20), EventLevel.Day),
    new Event('Marriage Equality Day (Australia)', '_hrc', 12, day(9), EventLevel.Day),
    new Event('Marriage Equality Day (New Zealand)', '_hrc', 8, day(19), EventLevel.Day),
    new Event('Marriage Referendum Anniversary (Ireland)', '_hrc', 5, day(22), EventLevel.Day),
    new Event('Freedom to Marry Day (US)', '_hrc', 2, day(12), EventLevel.Day),
    new Event('Anniversary of the Decriminalisation of Homosexuality in England and Wales (1967)', null, 7, day(27), EventLevel.Day),
    new Event('Anniversary of the Decriminalisation of Homosexuality in Scotland (1981)', '_law', 2, day(1), EventLevel.Day),
    new Event('{/terminology#two%20spirit=Two Spirit} Awareness Day', 'Two Spirit', 7, day(11), EventLevel.Day, ['two spirit']),
    new Event('LGBT Center Awareness Day (US)', null, 10, day(19), EventLevel.Day),
    new Event('{https://twitter.com/_EQUALGROUND_/status/1440232964286124050=Lesbian Visibility Day} (Sri Lanka)', 'Lesbian', 9, day(21), EventLevel.Day),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nlaad.html=Latinx AIDS Awareness Day} (US)', '_red-ribbon', 10, day(15), EventLevel.Day, ['aids']),
    new Event('{https://www.cdc.gov/hiv/library/awareness/shaad.html=Southern HIV/AIDS Awareness Day} (US)', '_red-ribbon', 8, day(20), EventLevel.Day, ['aids']),
    new Event('{https://www.cdc.gov/hiv/library/awareness/napihaad.html=Asian and Pacific Islander HIV/AIDS Awareness Day} (US)', '_red-ribbon', 5, day(19), EventLevel.Day, ['aids']),
    new Event('{https://www.cdc.gov/hiv/library/awareness/nnhaad.html=Native HIV/AIDS Awareness Day} (US)', '_red-ribbon', 3, day(20), EventLevel.Day, ['aids']),
    new Event('{/terminology#transgender=Trans} Visibility Day (Brazil)', 'Transgender', 1, day(29), EventLevel.Day, ['transgender']),
    new Event('National {/terminology#pride=Gay Pride} Day (Brazil)', 'LGBTQ', 3, day(25), EventLevel.Day),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Brazil)', 'Lesbian', 8, day(29), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Rebelliousness Day (Latin America)', 'Lesbian', 10, day(13), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Chile)', 'Lesbian', 7, day(9), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Argentina)', 'Lesbian', 3, day(7), EventLevel.Day, ['lesbian']),
    new Event('{/terminology#lesbian=Lesbian} Visibility Day (Paraguay)', 'Lesbian', 9, day(16), EventLevel.Day, ['lesbian']),
    new Event('Day of Activism for Sexual Diversity (Argentina)', 'LGBTQ', 8, day(20), EventLevel.Day),
    new Event('{/terminology#transgender=Trans} Rights Day (Argentina)', 'Transgender', 3, day(18), EventLevel.Day, ['transgender']),
    new Event('{/terminology#nonbinary=Nonbinary} People\'s Day (Poland)', 'Nonbinary', 3, day(9), EventLevel.Day, ['nonbinary']),
    new Event('{https://en.wikipedia.org/wiki/Matthew_Shepard=Matthew Shepard} Day of Remembrance', '_black-ribbon', 10, day(12), EventLevel.Day),
    new Event('{/terminology#transgender=Trans-}, {/terminology#travesti=Travesti} and {{/terminology#nonbinary=Non-Binary} Visibility Day (Paraguay)', 'Transgender', 10, day(15), EventLevel.Day, ['transgender', 'nonbinary', 'travesti']),
    new Event('Missing and Murdered Indigenous Women, Girls, and {/terminology#two%20spirit=Two Spirit} Awareness Day', 'Two Spirit', 5, day(5), EventLevel.Day, ['two spirit']),
    new Event('{/terminology#travesti=Travesti} and {/terminology#transgender=Transgender} Pride Day (Brazil)', 'Transgender', 5, day(15), EventLevel.Day, ['transgender', 'travesti']),
    new Event('National AIDS Day (Uruguay)', '_red-ribbon', 7, day(29), EventLevel.Day, ['aids']),
    new Event('National Day Against Violence and Homophobia Towards LGBTI People (Colombia)', null, 8, day(23), EventLevel.Day, ['homophobia', 'transphobia', 'biphobia']),
    new Event('LGBTI Rights Day (Paraguay)', 'LGBTQ', 9, day(30), EventLevel.Day, ['lgbtq']),
    new Event('Day Against Hate Crime (Peru)', null, 5, day(31), EventLevel.Day, ['homophobia', 'transphobia', 'biphobia']),
    new Event('National HIV Testing Day (Spain)', '_red-ribbon', 10, day(20), EventLevel.Day, ['aids']),
    new Event('National HIV Testing Day (Mexico)', '_red-ribbon', 11, day(23), EventLevel.Day, ['aids']),
    new Event('National HIV Testing Day (Peru)', '_red-ribbon', 6, day(10), EventLevel.Day, ['aids']),
    new Event('Suicide Prevention Day (Uruguay)', '_yellow-ribbon', 7, day(17), EventLevel.Day),
    new Event('Suicide Prevention Day (Puerto Rico)', '_yellow-ribbon', 8, day(12), EventLevel.Day),
    new Event('{https://www.instagram.com/p/CY_mGaGo9sm/=Nonbinary Grandparents\' Day} (Poland)', 'Nonbinary', 1, day(23), EventLevel.Day, ['nonbinary']),
    new Event('{https://standbyme.uk/nbad/=Bystander Awareness Day} (UK)', null, 3, day(13), EventLevel.Day),
    new Event('{https://en.wikipedia.org/wiki/UpStairs_Lounge_arson_attack=UpStairs Lounge Arson Attack} Remembrance Day', '_black-ribbon', 6, day(24), EventLevel.Day),
    new Event('Admiral Duncan Pub Bombing Remembrance Day', '_black-ribbon', 4, day(30), EventLevel.Day),
    new Event('Anniversary of the {https://en.wikipedia.org/wiki/Dance_of_the_Forty-One=Dance of the Forty-One} (Mexico)', null, 11, day(18), EventLevel.Day),
    new Event('{https://en.wikipedia.org/wiki/Marielle_Franco=Marielle Franco} Day of Remembrance (Brazil)', '_black-ribbon', 3, day(14), EventLevel.Day),
    new Event('{https://tdor.translivesmatter.info/reports/2019/05/06/milo-mazurkiewicz_warsaw-masovia-poland_9a028d4a=Milo Mazurkiewicz} Day of Remembrance (Poland)', '_black-ribbon', 5, day(6), EventLevel.Day, ['transgender', 'nonbinary']),
    new Event('Anniversary of Operation Hyacinth (Poland)', null, 11, day(15), EventLevel.Day, ['homophobia']),
    new Event('Marriage Equality Day (Germany)', '_hrc', 10, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Austria/Luxembourg/Norway)', '_hrc', 1, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Belgium)', '_hrc', 6, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Faroe Islands/Switzerland)', '_hrc', 7, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Spain)', '_hrc', 7, day(3), EventLevel.Day),
    new Event('Marriage Equality Day (Argentina)', '_hrc', 7, day(15), EventLevel.Day),
    new Event('Marriage Equality Day (Uruguay)', '_hrc', 8, day(5), EventLevel.Day),
    new Event('Marriage Equality Day (Colombia)', '_hrc', 4, day(28), EventLevel.Day),
    new Event('Marriage Equality Day (Ecuador)', '_hrc', 7, day(8), EventLevel.Day),
    new Event('Marriage Equality Day (Costa Rica)', '_hrc', 5, day(26), EventLevel.Day),
    new Event('Marriage Equality Day (Portugal)', '_hrc', 6, day(5), EventLevel.Day),
    new Event('Marriage Equality Day (Brazil)', '_hrc', 5, day(16), EventLevel.Day),
    new Event('Marriage Equality Day (Netherlands)', '_hrc', 4, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (France)', '_hrc', 5, day(18), EventLevel.Day),
    new Event('Marriage Equality Day (Sweden)', '_hrc', 5, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Finland)', '_hrc', 3, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (South Africa)', '_hrc', 11, day(30), EventLevel.Day),
    new Event('Marriage Equality Day (Iceland)', '_hrc', 6, day(27), EventLevel.Day),
    new Event('Marriage Equality Day (Denmark)', '_hrc', 6, day(15), EventLevel.Day),
    new Event('Marriage Equality Day (Greenland)', '_hrc', 4, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Malta)', '_hrc', 9, day(1), EventLevel.Day),
    new Event('Marriage Equality Day (Taiwan)', '_hrc', 5, day(24), EventLevel.Day),
    new Event('Marriage Equality Day (Chile)', '_hrc', 3, day(10), EventLevel.Day),
    new Event('{https://www.hiv.gov/blog/caribbean-american-hivaids-awareness-day-hiv-in-the-caribbean-region=Caribbean-American HIV/AIDS Awareness Day} (US)', '_red-ribbon', 6, day(8), EventLevel.Day, ['aids']),
    new Event('{/terminology#lesbian=Lesbian} {https://www.bng.gal/articulo/novas/dia-visibilidade-lesbica-galega/20210608103130030074.html=Visibility Day} (Galicia)', 'Lesbian', 6, day(8), EventLevel.Day, ['lesbian']),
    new Event('{https://napwha.org.au/about-us/national-network-of-women/=National Day of Women living with HIV} (Australia)', '_red-ribbon', 3, day(9), EventLevel.Day, ['aids']),
    new Event('{https://en.wikipedia.org/wiki/David_Kato=Kuchu Remembrance Day} (Uganda)', '_black-ribbon', 1, day(26), EventLevel.Day),
    new Event('{https://www.reuters.com/world/europe/two-dead-several-wounded-norway-nightclub-shooting-police-say-2022-06-25/=Oslo London Pub Shooting}', '_black-ribbon', 6, day(25), EventLevel.Day),

    // --- dynamic date ---

    // last Friday of August
    new Event('Wear it Purple Day (Australia)', null, 8, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    // third Thursday of October
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

    // last Friday of February
    new Event('Purple Friday (UK)', null, 2, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    // last Friday of October
    new Event('Rainbow Friday (Poland)', 'LGBTQ', 10, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    // second Friday of December
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

    // week (Sun-Sun) containing Dec 1st
    new Event('Aboriginal and Torres Strait Islander HIV Awareness Week (Australia)', '_red-ribbon', 12, function* (monthDays) {
        const decFirst = [...monthDays][0];
        const days = new Set([decFirst]);
        let d = decFirst;
        while (d.dayOfWeek !== 7) {
            d = d.prev();
            days.add(d)
        }
        d = decFirst;
        while (days.size < 8) {
            d = d.next();
            days.add(d)
        }
        yield* days;
    }, EventLevel.Week, ['aids']),

    // Dec 1 - 7
    new Event('Indigenous AIDS Awareness Week (Canada)', '_red-ribbon', 12, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day <= 7) {
                yield d;
            }
        }
    }), EventLevel.Week, ['aids']),

    // Nov 24 - Dec 1
    new Event('AIDS Awareness Week (Canada)', '_red-ribbon', 11, function* (monthDays) {
        let lastDay = null;
        for (let d of monthDays) {
            if (d.day >= 24) {
                yield d;
            }
            lastDay = d;
        }
        yield new Day(lastDay.year, 12, 1);
    }, EventLevel.Week, ['aids']),

    // second Thursday of September
    new Event('{https://en.wikipedia.org/wiki/R_U_OK%3F=R U OK? Day (Australia)}', '_yellow-ribbon', 9, function* (monthDays) {
        let thursdays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 4) {
                thursdays++;
                if (thursdays === 2) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day),

    // Sep 24 - Oct 1
    new Event('{https://www.facebook.com/voicecelebration/=Iranian Queer Voice Celebration Week}', 'Progress Pride', 9, function* (monthDays) {
        let lastDay = null;
        for (let d of monthDays) {
            if (d.day >= 24) {
                yield d;
            }
            lastDay = d;
        }
        yield new Day(lastDay.year, 10, 1);
    }, EventLevel.Week),

    // Paush 6 (Bikram Sambat)
    new NepaliEvent('{https://en.wikipedia.org/wiki/National_Gender_and_Sexual_Minorities%27_Day_(Nepal)=National Gender and Sexual Minorities\' Day} (Nepal)', 'LGBTQ', 9, function* (monthDays) {
        for (let d of monthDays) {
            if (d.nDay === 6) {
                yield d;
            }
        }
    }, EventLevel.Day, [], null, 'Paush 6 / पौष ६'),

    // one-off events
    new Event('Day of Silence', null, 4, dayYear(23, 2021), EventLevel.Day),
    new Event('Day of Silence', null, 4, dayYear(22, 2022), EventLevel.Day),

    // --- one-off events ---
    new Event('{https://www.darknessintolight.ie/=Darkness into Light} (Ireland)', '_yellow-ribbon', 5, dayYear(7, 2022), EventLevel.Day),

];
