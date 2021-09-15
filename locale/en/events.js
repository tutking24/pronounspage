import {Event, day, week, month, dayYear, EventLevel} from "../../src/calendar/helpers";

export default [
    // months
    new Event('LGBT History Month (UK/Hungary/Netherlands)', 'Progress Pride', 2, month, EventLevel.Month),
    new Event('LGBT History Month (US/Canada/Australia)', 'Progress Pride', 10, month, EventLevel.Month),
    new Event('LGBT History Month (Ireland/Germany)', 'Progress Pride', 5, month, EventLevel.Month),

    // static date
    new Event('Harvey Milk Day', null, 5, day(22), EventLevel.MajorDay),
    new Event('Pink Triangle Day (Canada)', null, 2, day(14), EventLevel.MajorDay),
    new Event('Marriage Equality Day (US)', null, 6, day(26), EventLevel.MajorDay),
    new Event('Marriage Equality Day (England and Wales)', null, 3, day(13), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Scotland)', null, 12, day(16), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Northern Ireland)', null, 1, day(13), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Canada)', null, 7, day(20), EventLevel.MajorDay),
    new Event('Marriage Equality Day (Australia)', null, 12, day(9), EventLevel.MajorDay),
    new Event('Marriage Equality Day (New Zealand)', null, 8, day(19), EventLevel.MajorDay),
    new Event('Marriage Referendum Anniversary (Ireland)', null, 5, day(22), EventLevel.MajorDay),
];
