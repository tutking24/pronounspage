import {Event, day, week, month, dayYear} from "../../src/calendar/helpers";

export default [
    // namedays
    new Event('nameday_andrea', null, 4, day(30), false),

    // one-off events
    new Event('pridemarch_warsaw', null, 1, dayYear(2, 2021), true),
    new Event('pridemarch_warsaw', null, 1, dayYear(4, 2020), true),
];
