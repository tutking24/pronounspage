const {Event, Day, day, week, month, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('pride_month', 'Progress Pride', 6, month, EventLevel.Month, ['lgbtq', 'pride parade', 'gay', 'homosexual']),
    new Event('trans_month', 'Transgender', 11, month, EventLevel.Month, ['transgender']),
    new Event('bi_health_month', 'Bisexual', 3, month, EventLevel.Month, ['bisexual']),
    new Event('aro_month', 'Aromantic', 2, month, EventLevel.Month, ['aromantic', 'aromantic spectrum']),
    new Event('suicide_prevention_month', '_yellow-ribbon', 9, month, EventLevel.Month),
    new Event('aids_awareness_month', '_red-ribbon', 12, month, EventLevel.Month, ['aids']),

    // project celebrations
    new Event('zaimki_birthday', '_zaimki', 7, day(23), EventLevel.Day),

    // static date
    new Event('agender_day', 'Agender', 5, day(19), EventLevel.Day, ['agender']),
    new Event('asexuality_day', 'Asexual', 4, day(6), EventLevel.Day, ['asexual', 'asexual spectrum']),
    new Event('bisexuality_day', 'Bisexual', 9, day(23), EventLevel.Day, ['bisexual']),
    new Event('drag_day', '-Drag', 7, day(16), EventLevel.Day, ['drag']),
    new Event('idahobit', null, 5, day(17), EventLevel.Day, ['homophobia', 'transphobia', 'biphobia']),
    new Event('intersex_day', 'Intersex', 10, day(26), EventLevel.Day, ['intersex']),
    new Event('intersex_remembrance_day', 'Intersex', 11, day(8), EventLevel.Day, ['intersex']),
    new Event('lesbian_day', 'Lesbian', 10, day(8), EventLevel.Day, ['lesbian', 'homosexual']),
    new Event('lesbian_visibility_day', 'Lesbian', 4, day(26), EventLevel.Day, ['lesbian', 'homosexual']),
    new Event('coming_out_day', null, 10, day(11), EventLevel.Day, ['coming out']),
    new Event('nonbinary_day', 'Nonbinary', 7, day(14), EventLevel.Day, ['nonbinary']),
    new Event('pan_day', 'Pansexual', 5, day(24), EventLevel.Day, ['pansexual', 'panromantic']),
    new Event('trans_remembrance_day', 'Transgender', 11, day(20), EventLevel.Day, ['transgender']),
    new Event('trans_visibility_day', 'Transgender', 3, day(31), EventLevel.Day, ['transgender']),
    new Event('zero_discrimination_day', null, 3, day(1), EventLevel.Day, ['homophobia', 'transphobia', 'biphobia']),
    new Event('polyamory_day', 'Polyamorous', 11, day(23), EventLevel.Day, ['polyamory', 'polyamorous']),
    new Event('homophobia_sport', null, 2, day(19), EventLevel.Day, ['homophobia']),
    new Event('lgbtq_stem', null, 11, day(18), EventLevel.Day, ['lgbtq']),
    new Event('trans_depathologization', 'Transgender', 10, day(22), EventLevel.Day, ['transgender']),
    new Event('lgbti_book_day', 'LGBTQ', 4, day(1), EventLevel.Day, ['lgbtq']),
    new Event('human_rights_day', null, 12, day(10), EventLevel.Day),
    new Event('nonbinary_parents_day', 'Nonbinary', 4, day(18), EventLevel.Day, ['nonbinary']),
    new Event('trans_prisoner', 'Transgender', 1, day(22), EventLevel.Day, ['transgender']),
    new Event('xenogender_day', 'Xenogender', 5, day(15), EventLevel.Day, ['xenogender']),
    new Event('genderqueer_day', 'Genderqueer', 4, day(25), EventLevel.Day, ['genderqueer']),
    new Event('genderfluid_day', 'Genderfluid', 6, day(16), EventLevel.Day, ['genderfluid', 'demifluid']),
    new Event('aids_day', '_red-ribbon', 12, day(1), EventLevel.Day, ['aids']),
    new Event('tolerance_day', null, 11, day(16), EventLevel.Day),
    new Event('social_justice_day', null, 2, day(20), EventLevel.Day, ['progress pride']),
    new Event('stonewall_day', 'Progress Pride', 6, day(28), EventLevel.Day, ['pride parade']),
    new Event('domestic_violence', null, 5, day(25), EventLevel.Day, ['lgbtq']),
    new Event('polysexual_day', 'Polysexual', 7, day(26), EventLevel.Day, ['polysexual', 'polyromantic']),
    new Event('orlando_day', '_black-ribbon', 6, day(12), EventLevel.Day, ['homophobia']),
    new Event('demigender_day', 'Demigender', 12, day(15), EventLevel.Day, ['demigender', 'demiboy', 'demigirl', 'deminonbinary', 'demineutrois', 'demifluid']),
    new Event('pan_pride_day', 'Pansexual', 12, day(8), EventLevel.Day, ['pansexual', 'panromantic']),
    new Event('transmasculine_day', 'Transmasculine', 2, day(20), EventLevel.Day, ['trans man', 'transmasculine']),
    new Event('asexual_visibility_day', 'Asexual', 5, day(8), EventLevel.Day, ['asexual', 'asexual spectrum']),
    new Event('holocaust_remembrance_day', '_black-ribbon', 1, day(27), EventLevel.Day),
    new Event('black_ribbon_day', '_black-ribbon', 8, day(23), EventLevel.Day),
    new Event('mena_lesbian_day', 'Lesbian', 6, day(13), EventLevel.Day, ['lesbian', 'progress pride', 'homosexual']),
    new Event('suicide_prevention_day', '_yellow-ribbon', 9, day(10), EventLevel.Day),
    new Event('parents_day', '_hrc', 12, day(6), EventLevel.Day),
    new Event('hiv_testing_day', '_red-ribbon', 6, day(27), EventLevel.Day, ['aids']),

    // dynamic date
    new Event('arospec_week', 'Aromantic', 2, week(function* (monthDays) {
        let started = false;
        for (let d of monthDays) {
            if (!started && d.day > 14 && d.dayOfWeek === 7) {
                started = true;
            }
            if (started) {
                yield d;
            }
        }
    }), EventLevel.Week, ['aromantic', 'aromantic spectrum']),

    new Event('asexual_week', 'Asexual', 10, week(function* (monthDays) {
        let started = false;
        for (let d of monthDays) {
            if (!started && d.day >= 19 && d.dayOfWeek === 7) {
                started = true;
            }
            if (started) {
                yield d;
            }
        }
    }), EventLevel.Week, ['asexual', 'asexual spectrum']),

    new Event('bisexual_week', 'Bisexual', 9, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 16 && d.day <= 22) {
                yield d;
            }
        }
    }), EventLevel.Week, ['bisexual']),

    new Event('pronouns_day', null, 10, function* (monthDays) {
        let wednesdays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 3) {
                wednesdays++;
                if (wednesdays === 3) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day, ['neopronouns']),

    new Event('trans_week', 'Transgender', 11, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 13 && d.day <= 19) {
                yield d;
            }
        }
    }), EventLevel.Week, ['transgender']),

    new Event('trans_parent_day', 'Transgender', 11, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                yield d;
                return;
            }
        }
    }), EventLevel.Day, ['transgender']),

    new Event('nonbinary_week', 'Nonbinary', 7, week(function* (monthDays) {
        let buffer = [];
        for (let d of monthDays) {
            if (d.day >= 14) {
                for (let dd of buffer) {
                    yield dd;
                }
                buffer = [];
                yield d;
                continue;
            }

            if (d.dayOfWeek === 1) {
                buffer = [];
            }
            buffer.push(d);
        }
    }), EventLevel.Week, ['nonbinary']),

    new Event('gay_uncles_day', 'Gay_', 8, function* (monthDays) {
        let sundays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                sundays++;
                if (sundays === 2) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day, ['gay', 'homosexual']),

    new Event('aids_memorial', '_red-ribbon', 5, function* (monthDays) {
        let sundays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                sundays++;
                if (sundays === 3) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day, ['aids']),

    new Event('health_week', 'LGBTQ', 3, week(function* (monthDays) {
        let prevBuffer = [];
        let buffer = [];
        for (let d of monthDays) {
            if (d.dayOfWeek <= 5) {
                buffer.push(d);
            }
            if (d.dayOfWeek === 5) {
                prevBuffer = buffer;
                buffer = [];
            }
        }
        yield* prevBuffer;
    }), EventLevel.Week),

    new Event('lesbian_visibility_week', 'Lesbian', 4, week(function* (monthDays) {
        let lastDay = null;
        for (let d of monthDays) {
            if (d.day >= 26) {
                yield d;
            }
            lastDay = d;
        }
        yield new Day(lastDay.year, 5, 1);
        yield new Day(lastDay.year, 5, 2);
    }), EventLevel.Week, ['lesbian']),

    new Event('family_equality_day', '_hrc', 5, function* (monthDays) {
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                yield d;
                return;
            }
        }
    }, EventLevel.Day),

    new Event('black_queer_week', 'Progress Pride', 2, week(function* (monthDays) {
        const weeks = [];
        for (let d of monthDays) {
            if (d.dayOfWeek === 1) {
                weeks.push([]);
            }
            if (weeks.length === 0) {
                continue;
            }
            weeks[weeks.length - 1].push(d);
        }
        yield* weeks[2];
    }), EventLevel.Week, ['progress pride']),


    new Event('hate_crime_awareness_week', null, 10, function* (monthDays) {
        let saturdays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 6) {
                saturdays++;
            }
            if (saturdays === 2 || (saturdays === 3 && d.dayOfWeek === 6)) {
                yield d;
            }
        }
    }, EventLevel.Week, ['homophobia', 'transphobia', 'biphobia']),

    new Event('genderfluid_week', 'Genderfluid', 10, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 17 && d.day <= 24) {
                yield d;
            }
        }
    }), EventLevel.Week, ['genderfluid']),

    new Event('pan_week', 'Pansexual', 12, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 6) {
                yield d;
            }
        }
    }), EventLevel.Week, ['pansexual', 'panromantic']),

    // one-off events
    new Event('deaf_awareness_week', 'Progress Pride', 4, function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 11 && d.day <= 17 && d.year === 2021) {
                yield d;
            }
        }
    }, EventLevel.Week, ['progress pride']),

];
