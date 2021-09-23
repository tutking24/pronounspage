const {Event, Day, day, week, month, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('pride_month', 'Progress Pride', 6, month, EventLevel.Month),
    new Event('trans_month', 'Transgender', 11, month, EventLevel.Month),
    new Event('bi_health_month', 'Bisexual', 3, month, EventLevel.Month),
    new Event('aro_month', 'Aromantic', 2, month, EventLevel.Month),

    // project celebrations
    new Event('zaimki_birthday', null, 7, day(23), EventLevel.MajorDay),

    // static date
    new Event('agender_day', 'Agender', 5, day(19), EventLevel.MajorDay),
    new Event('asexuality_day', 'Asexual', 4, day(6), EventLevel.MajorDay),
    new Event('bisexuality_day', 'Bisexual', 9, day(23), EventLevel.MajorDay),
    new Event('drag_day', '-Drag', 7, day(16), EventLevel.MajorDay),
    new Event('idahobit', null, 5, day(17), EventLevel.MajorDay),
    new Event('intersex_day', 'Intersex', 10, day(26), EventLevel.MajorDay),
    new Event('intersex_remembrance_day', 'Intersex', 11, day(8), EventLevel.MajorDay),
    new Event('lesbian_day', 'Lesbian', 10, day(8), EventLevel.MajorDay),
    new Event('lesbian_visibility_day', 'Lesbian', 4, day(26), EventLevel.MajorDay),
    new Event('coming_out_day', null, 10, day(11), EventLevel.MajorDay),
    new Event('nonbinary_day', 'Nonbinary', 7, day(14), EventLevel.MajorDay),
    new Event('pan_day', 'Pansexual', 5, day(24), EventLevel.MajorDay),
    new Event('trans_remembrance_day', 'Transgender', 11, day(20), EventLevel.MajorDay),
    new Event('trans_visibility_day', 'Transgender', 3, day(31), EventLevel.MajorDay),
    new Event('zero_discrimination_day', null, 3, day(1), EventLevel.MajorDay),
    new Event('polyamory_day', 'Polyamorous', 11, day(23), EventLevel.MajorDay),
    new Event('homophobia_sport', null, 2, day(19), EventLevel.MajorDay),
    new Event('lgbtq_stem', null, 11, day(18), EventLevel.MajorDay),
    new Event('trans_depathologization', 'Transgender', 10, day(22), EventLevel.MajorDay),
    new Event('lgbti_book_day', 'LGBTQ', 4, day(1), EventLevel.MajorDay),
    new Event('human_rights_day', null, 12, day(10), EventLevel.MajorDay),
    new Event('nonbinary_parents_day', 'Nonbinary', 4, day(18), EventLevel.MajorDay),
    new Event('trans_prisoner', 'Transgender', 1, day(22), EventLevel.MajorDay),
    new Event('xenogender_day', 'Xenogender', 5, day(15), EventLevel.MajorDay),
    new Event('genderqueer_day', 'Genderqueer', 4, day(25), EventLevel.MajorDay),
    new Event('genderfluid_day', 'Genderfluid', 6, day(16), EventLevel.MajorDay),
    new Event('aids_day', null, 12, day(1), EventLevel.MajorDay),
    new Event('tolerance_day', null, 11, day(16), EventLevel.MajorDay),
    new Event('social_justice_day', null, 2, day(20), EventLevel.MajorDay),
    new Event('stonewall_day', 'Progress Pride', 6, day(28), EventLevel.MajorDay),
    new Event('domestic_violence', null, 5, day(25), EventLevel.MajorDay),
    new Event('polysexual_day', 'Polysexual', 7, day(26), EventLevel.MajorDay),
    new Event('orlando_day', null, 6, day(12), EventLevel.MajorDay),
    new Event('demigender_day', 'Demigender', 12, day(15), EventLevel.MajorDay),
    new Event('pan_pride_day', 'Pansexual', 12, day(8), EventLevel.MajorDay),
    new Event('transmasculine_day', 'Transmasculine', 2, day(20), EventLevel.MajorDay),
    new Event('asexual_visibility_day', 'Asexual', 5, day(8), EventLevel.MajorDay),
    new Event('holocaust_remembrance_day', null, 1, day(27), EventLevel.MajorDay),
    new Event('black_ribbon_day', null, 8, day(23), EventLevel.MajorDay),
    new Event('mena_lesbian_day', null, 6, day(13), EventLevel.MajorDay),

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
    }), EventLevel.Week),

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
    }), EventLevel.Week),

    new Event('bisexual_week', 'Bisexual', 9, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 16 && d.day <= 22) {
                yield d;
            }
        }
    }, EventLevel.Week)),

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
    }, EventLevel.MajorDay),

    new Event('trans_week', 'Transgender', 11, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 13 && d.day <= 19) {
                yield d;
            }
        }
    }), EventLevel.Week),

    new Event('trans_parent_day', 'Transgender', 11, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                yield d;
                return;
            }
        }
    }, true)),

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
    }), EventLevel.Week),

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
    }, EventLevel.MajorDay),

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
    }, EventLevel.MajorDay),

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
    }), EventLevel.Week),

    new Event('family_equality_day', null, 5, function* (monthDays) {
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                yield d;
                return;
            }
        }
    }, EventLevel.MajorDay),

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
];
