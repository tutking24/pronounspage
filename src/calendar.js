export class Day {
    constructor(year, month, day, dayOfWeek) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.dayOfWeek = dayOfWeek || new Date(year, month - 1, day).getDay() || 7;
    }

    static fromDate(date) {
        return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    static today() {
        return Day.fromDate(new Date);
    }

    equals(other) {
        return other && this.year === other.year && this.month === other.month && this.day === other.day;
    }

    toString() {
        return `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;
    }
}

export function* iterateMonth(year, month) {
    for (let day = 1; day <= 31; day++) {
        let d = new Date(year, month - 1, day);
        if (d.getDate() !== day) { return; }
        yield new Day(year, month, day, d.getDay() || 7);
    }
}

export class Event {
    constructor(name, flag, month, generator) {
        this.name = name;
        this.flag = flag;
        this.month = month;
        this.generator = generator;
        this.daysMemoise = {}
    }

    getDays(year) {
        if (this.daysMemoise[year] === undefined) {
            this.daysMemoise[year] = [...this.generator(iterateMonth(year, this.month))];
        }

        return this.daysMemoise[year];
    }

    length() {
        return [...this.getDays(2021)].length;
    }
}

function day (dayOfMonth) {
    function *internal (monthDays) {
        for (let d of monthDays) {
            if (d.day === dayOfMonth) {
                yield d;
            }
        }
    }

    return internal;
}

function *month (monthDays) {
    for (let d of monthDays) {
        yield d;
    }
}

function week (generator) {
    function *internal (monthDays) {
        let count = 0;
        for (let d of generator(monthDays)) {
            yield d;
            count++;
            if (count === 7) {
                return;
            }
        }
    }

    return internal;
}

export const events = [
    new Event('zaimki_birthday', null, 8, day(14)), // TODO

    new Event('pride_month', 'Progress Pride', 6, month),
    new Event('trans_month', 'Transgender', 11, month),

    new Event('zaimki_birthday', null, 7, day(23)),

    new Event('agender_day', 'Agender', 5, day(19)),
    new Event('asexuality_day', 'Asexual', 4, day(6)),
    new Event('bisexuality_day', 'Bisexual', 9, day(23)),
    new Event('drag_day', '-Drag', 6, day(16)),
    new Event('idahobit', null, 5, day(17)),
    new Event('intersex_day', 'Intersex', 10, day(26)),
    new Event('intersex_remembrance_day', 'Intersex', 11, day(8)),
    new Event('lesbian_day', 'Lesbian', 10, day(8)),
    new Event('lesbian_visibility_day', 'Lesbian', 4, day(26)),
    new Event('coming_out_day', null, 10, day(11)),
    new Event('nonbinary_day', 'Nonbinary', 7, day(14)),
    new Event('pan_day', 'Pansexual', 5, day(24)),
    new Event('trans_remembrance_day', 'Transgender', 11, day(20)),
    new Event('trans_visibility_day', 'Transgender', 3, day(31)),
    new Event('zero_discrimination_day', null, 3, day(1)),
    new Event('polyamory_day', 'Polyamorous', 11, day(23)),

    new Event('arospec_week', 'Aromantic', 2, week(function *(monthDays) {
        let started = false;
        for (let d of monthDays) {
            if (!started && d.day > 14 && d.dayOfWeek === 7) {
                started = true;
            }
            if (started) {
                yield d;
            }
        }
    })),

    new Event('asexual_week', 'Asexual', 10, week(function *(monthDays) {
        let started = false;
        for (let d of monthDays) {
            if (!started && d.day >= 19 && d.dayOfWeek === 7) {
                started = true;
            }
            if (started) {
                yield d;
            }
        }
    })),

    new Event('bisexual_week', 'Bisexual', 9, week(function *(monthDays) {
        for (let d of monthDays) {
            if (d.day >= 16 && d.day <= 22) {
                yield d;
            }
        }
    })),

    new Event('pronouns_day', null, 10, function *(monthDays) {
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
    }),

    new Event('trans_week', 'Transgender', 11, week(function *(monthDays) {
        for (let d of monthDays) {
            if (d.day >= 13 && d.day <= 19) {
                yield d;
            }
        }
    })),

    new Event('trans_parent_day', 'Transgender', 9, week(function *(monthDays) {
        for (let d of monthDays) {
            if (d.dayOfWeek === 7) {
                yield d;
                return;
            }
        }
    })),

    new Event('nonbinary_week', 'Nonbinary', 7, week(function *(monthDays) {
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
    })),
];

export class Year {
    constructor(year, events) {
        this.year = year;
        this.events = events;

        this.eventsByDate = {};
        for (let event of events) {
            for (let d of event.getDays(year)) {
                const k = d.toString();
                if (this.eventsByDate[k] === undefined) { this.eventsByDate[k] = []; }
                this.eventsByDate[k].push(event);
            }
        }
    }
}

export const currentYear = new Year(new Date().getFullYear(), events);
