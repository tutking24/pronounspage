import {Event, day, week, month, dayYear, EventLevel} from "../../src/calendar/helpers";

export default [
    // months
    new Event('Mes de la Historia LGBT (EE.UU.)', 'Progress Pride', 10, month, EventLevel.Month),
    
    // static date
    new Event('Día de la Igualdad Matrimonial (EE.UU.)', null, 6, day(26), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (España)', null, 7, day(3), EventLevel.MajorDay),
    new Event('Aniversario de la sanción de la Ley de Matrimonio Igualitario (Argentina)', null, 7, day(15), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Uruguay)', null, 8, day(5), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Colombia)', null, 4, day(28), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Ecuador)', null, 7, day(8), EventLevel.MajorDay),
    new Event('Día de la Igualdad Matrimonial (Costa Rica)', null, 5, day(26), EventLevel.MajorDay),
    new Event('Día de la Visibilidad Lésbica (Chile)', 'Lesbian', 7, day(9), EventLevel.MajorDay),
    new Event('Día de la Visibilidad Lésbica (Argentina)', 'Lesbian', 3, day(7), EventLevel.MajorDay),
    new Event('Día de la Visibilidad Lésbica (Paraguay)', 'Lesbian', 9, day(16), EventLevel.MajorDay),
    new Event('Día del Activismo por la Diversidad Sexual (Argentina)', 'LGBTQ', 8, day(20), EventLevel.MajorDay),
    new Event('Día de las Rebeldías Lésbicas', 'Lesbian_', 10, day(13), EventLevel.MajorDay),
    new Event('Día de la Promoción de los Derechos de las Personas Trans (Argentina)', 'Transgender', 3, day(18), EventLevel.MajorDay),
    new Event('Día de las Rebeldías Lésbicas', 'Lesbian_', 10, day(13), EventLevel.MajorDay),
    new Event('Aniversario de la Sanción de la Ley de Identidad de Género en Argentina', 'Transgender', 5, day(9), EventLevel.MajorDay),

]; 
