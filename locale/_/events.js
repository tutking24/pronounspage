const {Event, Day, day, week, month, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('pride_month', 'Progress Pride', 6, month, EventLevel.Month),
    new Event('trans_month', 'Transgender', 11, month, EventLevel.Month, ['transgender']),
    new Event('bi_health_month', 'Bisexual', 3, month, EventLevel.Month),
    new Event('aro_month', 'Aromantic', 2, month, EventLevel.Month), ['aromantic']),
    new Event('suicide_prevention_month', null, 9, month, EventLevel.Month),
    new Event('aids_awareness_month', null, 12, month, EventLevel.Month),

    // project celebrations
    new Event('zaimki_birthday', null, 7, day(23), EventLevel.Day),

    // static date
    new Event('agender_day', 'Agender', 5, day(19), EventLevel.Day, ['agender']),
    new Event('asexuality_day', 'Asexual', 4, day(6), EventLevel.Day), ['asexual']),
    new Event('bisexuality_day', 'Bisexual', 9, day(23), EventLevel.Day), ['bisexual']),
    new Event('drag_day', '-Drag', 7, day(16), EventLevel.Day), ['drag']),
    new Event('idahobit', null, 5, day(17), EventLevel.Day), ['homophobia']),
    new Event('intersex_day', 'Intersex', 10, day(26), EventLevel.Day), ['intersex']),
    new Event('intersex_remembrance_day', 'Intersex', 11, day(8), EventLevel.Day), ['intersex']),
    new Event('lesbian_day', 'Lesbian', 10, day(8), EventLevel.Day), ['lesbian']),
    new Event('lesbian_visibility_day', 'Lesbian', 4, day(26), EventLevel.Day), ['lesbian']),
    new Event('coming_out_day', null, 10, day(11), EventLevel.Day), ['coming out']),
    new Event('nonbinary_day', 'Nonbinary', 7, day(14), EventLevel.Day, ['nonbinary']),
    new Event('pan_day', 'Pansexual', 5, day(24), EventLevel.Day), ['pansexual']),
    new Event('trans_remembrance_day', 'Transgender', 11, day(20), EventLevel.Day), ['transgender']),
    new Event('trans_visibility_day', 'Transgender', 3, day(31), EventLevel.Day), ['transgender']),
    new Event('zero_discrimination_day', null, 3, day(1), EventLevel.Day),
    new Event('polyamory_day', 'Polyamorous', 11, day(23), EventLevel.Day), ['polyamory']),
    new Event('homophobia_sport', null, 2, day(19), EventLevel.Day), ['homophobia']),
    new Event('lgbtq_stem', null, 11, day(18), EventLevel.Day),
    new Event('trans_depathologization', 'Transgender', 10, day(22), EventLevel.Day), ['transgender']),
    new Event('lgbti_book_day', 'LGBTQ', 4, day(1), EventLevel.Day),
    new Event('human_rights_day', null, 12, day(10), EventLevel.Day),
    new Event('nonbinary_parents_day', 'Nonbinary', 4, day(18), EventLevel.Day), ['nonbinary']),
    new Event('trans_prisoner', 'Transgender', 1, day(22), EventLevel.Day), ['transgender']),
    new Event('xenogender_day', 'Xenogender', 5, day(15), EventLevel.Day), ['xenogender']),
    new Event('genderqueer_day', 'Genderqueer', 4, day(25), EventLevel.Day), ['genderqueer']),
    new Event('genderfluid_day', 'Genderfluid', 6, day(16), EventLevel.Day), ['genderfluid']),
    new Event('aids_day', null, 12, day(1), EventLevel.Day),
    new Event('tolerance_day', null, 11, day(16), EventLevel.Day),
    new Event('social_justice_day', null, 2, day(20), EventLevel.Day),
    new Event('stonewall_day', 'Progress Pride', 6, day(28), EventLevel.Day),
    new Event('domestic_violence', null, 5, day(25), EventLevel.Day),
    new Event('polysexual_day', 'Polysexual', 7, day(26), EventLevel.Day), ['polysexual']),
    new Event('orlando_day', null, 6, day(12), EventLevel.Day),
    new Event('demigender_day', 'Demigender', 12, day(15), EventLevel.Day), ['demigender']),
    new Event('pan_pride_day', 'Pansexual', 12, day(8), EventLevel.Day), ['pansexual']),
    new Event('transmasculine_day', 'Transmasculine', 2, day(20), EventLevel.Day), ['transmasculine']),
    new Event('asexual_visibility_day', 'Asexual', 5, day(8), EventLevel.Day), ['asexual']),
    new Event('holocaust_remembrance_day', null, 1, day(27), EventLevel.Day),
    new Event('black_ribbon_day', null, 8, day(23), EventLevel.Day),
    new Event('mena_lesbian_day', 'Lesbian', 6, day(13), EventLevel.Day), ['lesbian']),
    new Event('suicide_prevention_day', null, 9, day(10), EventLevel.Day),

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
    }), EventLevel.Week), ['aromantic']),

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
    }), EventLevel.Week), ['asexual']),

    new Event('bisexual_week', 'Bisexual', 9, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 16 && d.day <= 22) {
                yield d;
            }
        }
    }, EventLevel.Week)), ['bisexual']),

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
    }, EventLevel.Day),

    new Event('trans_week', 'Transgender', 11, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 13 && d.day <= 19) {
                yield d;
            }
        }
    }), EventLevel.Week), ['transgender']),

    new Event('trans_parent_day', 'Transgender', 11, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                yield d;
                return;
            }
        }
    }, true)), ['transgender']),

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
    }, EventLevel.Day), ['gay']),

    new Event('aids_memorial', null, 5, function* (monthDays) {
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
    }, EventLevel.Day),

    new Event('health_week', null, 3, week(function* (monthDays) {
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
    }), EventLevel.Week), ['lesbian']),

    new Event('family_equality_day', null, 5, function* (monthDays) {
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
    }), EventLevel.Week),


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
    }, EventLevel.Week),

    // one-off events
    new Event('deaf_awareness_week', 'Progress Pride', 4, function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 11 && d.day <= 17 && d.year === 2021) {
                yield d;
            }
        }
    }, EventLevel.Week),
];
