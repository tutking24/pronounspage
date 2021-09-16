import {Event, day, week, month, dayYear, EventLevel} from "../../src/calendar/helpers";

export default [
    // months
    new Event('Mes de la Historia LGBT (EE.UU.)', 'Progress Pride', 10, month, EventLevel.Month),
    
    // static date
    new Event('Día de la Igualdad Matrimonial (EE.UU.)', null, 6, day(26), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (España)', null, 7, day(3), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Argentina)', null, 7, day(22), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Uruguay)', null, 8, day(5), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Colombia)', null, 4, day(28), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Ecuador)', null, 7, day(8), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Costa Rica)', null, 5, day(26), EventLevel.MajorDay),
    
];
