const md5 = require("js-md5");
const { v5: uuid5 } = require('uuid');

class Day {
    constructor(year, month, day, dayOfWeek) {
        this.year = parseInt(year);
        this.month = parseInt(month);
        this.day = parseInt(day);
        this.dayOfWeek = dayOfWeek ? parseInt(dayOfWeek) : new Date(this.year, this.month - 1, this.day).getDay() || 7;
    }

    static fromDate(date) {
        return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    static today() {
        return Day.fromDate(new Date);
    }

    toDate() {
        return new Date(this.year, this.month - 1, this.day);
    }

    equals(other) {
        return other && this.year === other.year && this.month === other.month && this.day === other.day;
    }

    toString() {
        return `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;
    }

    // for comparisons
    toInt() {
        return parseInt(`${this.year}${this.month.toString().padStart(2, '0')}${this.day.toString().padStart(2, '0')}`);
    }

    next() {
        let d = this.toDate();
        d.setDate(d.getDate() + 1);
        return Day.fromDate(d);
    }

    prev() {
        let d = this.toDate();
        d.setDate(d.getDate() - 1);
        return Day.fromDate(d);
    }
}
module.exports.Day = Day;

function* iterateMonth(year, month) {
    for (let day = 1; day <= 31; day++) {
        let d = new Date(year, month - 1, day);
        if (d.getDate() !== day) { return; }
        yield new Day(year, month, day, d.getDay() || 7);
    }
}
module.exports.iterateMonth = iterateMonth;

module.exports.EventLevel = {
    Month: 0,
    Week: 1,
    Nameday: 2,
    Day: 3,
}

module.exports.Event = class {
    constructor(name, flag, month, generator, level, terms = [], timeDescription = null) {
        this.name = name;
        this.flag = flag;
        this.month = month;
        this.generator = generator;
        this.level = level;
        this.terms = terms;
        this.timeDescription = timeDescription;
        this.daysMemoise = {}
    }

    getDays(year) {
        year = parseInt(year);
        if (this.daysMemoise[year] === undefined) {
            this.daysMemoise[year] = [...this.generator(iterateMonth(year, this.month))];
        }

        return this.daysMemoise[year];
    }

    length() {
        return [...this.getDays(2021)].length;
    }

    getRange(year) {
        if (year === undefined) {
            year = Day.today().year;
        }
        const days = this.getDays(year);
        if (days.length === 1) {
            return days[0].day;
        }

        return `${days[0].day} – ${days[days.length - 1].day}`;
    }

    isFirstDay(day) {
        return this.getDays(day.year)[0].equals(day);
    }

    getUuid() {
        return uuid5(`${process.env.BASE_URL}/calendar/event/${this.name}`, uuid5.URL);
    }

    toIcs(year, translations, clearLinkedText, sequence = 1) {
        const days = this.getDays(year);
        const first = days[0];
        const last = days[days.length - 1].next();

        let [name, param] = this.name.split('$');
        if (translations.calendar.events[name] !== undefined) {
            name = translations.calendar.events[name];
        }
        if (param) {
            name = name.replace(/%param%/g, param);
        }
        name = clearLinkedText(name);

        return {
            title: name,
            start: [first.year, first.month, first.day],
            end: [last.year, last.month, last.day],
            calName: translations.calendar.headerLong,
            sequence,
        }
    }
}

module.exports.day = function (dayOfMonth) {
    function *internal (monthDays) {
        for (let d of monthDays) {
            if (d.day === dayOfMonth) {
                yield d;
            }
        }
    }

    return internal;
}

module.exports.month = function* (monthDays) {
    for (let d of monthDays) {
        yield d;
    }
}

module.exports.week = function (generator) {
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

module.exports.dayYear = function (day, year) {
    function *internal (monthDays) {
        for (let d of monthDays) {
            if (d.day === day && d.year === year) {
                yield d;
            }
        }
    }

    return internal;
}

class Year {
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
        for (let date in this.eventsByDate) {
            if (!this.eventsByDate.hasOwnProperty(date)) { continue; }
            this.eventsByDate[date].sort((a, b) => b.level - a.level);
        }

        this.eventsByTerm = {}
        for (let event of events) {
            for (let term of event.terms) {
                if (this.eventsByTerm[term] === undefined) { this.eventsByTerm[term] = []; }
                if (event.getDays(this.year).length) {
                    this.eventsByTerm[term].push(event);
                }
            }
        }
        for (let term in this.eventsByTerm) {
            if (!this.eventsByTerm.hasOwnProperty(term)) { continue; }
            this.eventsByTerm[term].sort((a, b) => a.getDays(this.year)[0].toInt() - b.getDays(this.year)[0].toInt())
        }

        this.eventsByUuid = {}
        for (let event of events) {
            this.eventsByUuid[event.getUuid()] = event;
        }
    }

    isCurrent() {
        return this.year === Day.today().year;
    }
}
module.exports.Year = Year;

module.exports.Calendar = class {
    constructor(events, minYear = 0, maxYear = 9999) {
        this._events = events;
        this._minYear = minYear;
        this._maxYear = maxYear;
        this._years = {};
    }

    getYear(year) {
        year = parseInt(year);
        if (year < this._minYear || year > this._maxYear) {
            return null;
        }

        if (this._years[year] === undefined) {
            this._years[year] = new Year(year, this._events);
        }

        return this._years[year];
    }

    getCurrentYear() {
        return this.getYear(Day.today().year);
    }

    *getAllYears() {
        for (let y = this._minYear; y <= this._maxYear; y++) {
            yield this.getYear(y);
        }
    }

    buildSummary() {
        const summary = {};
        for (let year of this.getAllYears()) {
            for (let month = 1; month <= 12; month++) {
                for (let day of iterateMonth(year.year, month)) {
                    const events = [];
                    for (let event of year.eventsByDate[day.toString()] || []) {
                        events.push(event.name);
                    }
                    summary[day.toString()] = md5(JSON.stringify(events));
                }
            }
        }
        return summary;
    }
}
