import {Event, day, week, month, dayYear} from "../../src/calendar/helpers";

export default [
    // months
    new Event('pride_month', 'Progress Pride', 6, month, false),
    new Event('trans_month', 'Transgender', 11, month, false),

    // project celebrations
    new Event('zaimki_birthday', null, 7, day(23), true),

    // static date
    new Event('agender_day', 'Agender', 5, day(19), true),
    new Event('asexuality_day', 'Asexual', 4, day(6), true),
    new Event('bisexuality_day', 'Bisexual', 9, day(23), true),
    new Event('drag_day', '-Drag', 7, day(16), true),
    new Event('idahobit', null, 5, day(17), true),
    new Event('intersex_day', 'Intersex', 10, day(26), true),
    new Event('intersex_remembrance_day', 'Intersex', 11, day(8), true),
    new Event('lesbian_day', 'Lesbian', 10, day(8), true),
    new Event('lesbian_visibility_day', 'Lesbian', 4, day(26), true),
    new Event('coming_out_day', null, 10, day(11), true),
    new Event('nonbinary_day', 'Nonbinary', 7, day(14), true),
    new Event('pan_day', 'Pansexual', 5, day(24), true),
    new Event('trans_remembrance_day', 'Transgender', 11, day(20), true),
    new Event('trans_visibility_day', 'Transgender', 3, day(31), true),
    new Event('zero_discrimination_day', null, 3, day(1), true),
    new Event('polyamory_day', 'Polyamorous', 11, day(23), true),

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
    }, false)),

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
    }, false)),

    new Event('bisexual_week', 'Bisexual', 9, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 16 && d.day <= 22) {
                yield d;
            }
        }
    }, false)),

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
    }, true),

    new Event('trans_week', 'Transgender', 11, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day >= 13 && d.day <= 19) {
                yield d;
            }
        }
    }, false)),

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
    }, false)),
];
