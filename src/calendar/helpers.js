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
    constructor(name, flag, month, generator, major) {
        this.name = name;
        this.flag = flag;
        this.month = month;
        this.generator = generator;
        this.major = major;
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

export function day (dayOfMonth) {
    function *internal (monthDays) {
        for (let d of monthDays) {
            if (d.day === dayOfMonth) {
                yield d;
            }
        }
    }

    return internal;
}

export function *month (monthDays) {
    for (let d of monthDays) {
        yield d;
    }
}

export function week (generator) {
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

export function dayYear (day, year) {
    function *internal (monthDays) {
        for (let d of monthDays) {
            if (d.day === day && d.year === year) {
                yield d;
            }
        }
    }

    return internal;
}

export class Calendar {
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
