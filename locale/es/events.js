const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('Mes de la Historia LGBT (EE.UU.)', 'Progress Pride', 10, month, EventLevel.Month),
    new Event('Mes de la Diversidad (Uruguay)', 'LGBTQ', 9, month, EventLevel.Month),

    // static date
    new Event('Día de la Igualdad Matrimonial (EE.UU.)', null, 6, day(26), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (España)', null, 7, day(3), EventLevel.Day),
    new Event('Aniversario de la sanción de la Ley de Matrimonio Igualitario (Argentina)', null, 7, day(15), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Uruguay)', null, 8, day(5), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Colombia)', null, 4, day(28), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Ecuador)', null, 7, day(8), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Costa Rica)', null, 5, day(26), EventLevel.Day),
    new Event('Día de la Visibilidad Lésbica (Chile)', 'Lesbian', 7, day(9), EventLevel.Day, ['lesbian']),
    new Event('Día de la Visibilidad Lésbica (Argentina)', 'Lesbian', 3, day(7), EventLevel.Day, ['lesbian']),
    new Event('Día de la Visibilidad Lésbica (Paraguay)', 'Lesbian', 9, day(16), EventLevel.Day, ['lesbian']),
    new Event('Día del Activismo por la Diversidad Sexual (Argentina)', 'LGBTQ', 8, day(20), EventLevel.Day),
    new Event('Día de las Rebeldías Lésbicas', 'Lesbian_', 10, day(13), EventLevel.Day, ['lesbian']),
    new Event('Día de la Promoción de los Derechos de las Personas Trans (Argentina)', 'Transgender', 3, day(18), EventLevel.Day, ['transgender']),
    new Event('Aniversario de la Sanción de la Ley de Identidad de Género en Argentina', 'Transgender', 5, day(9), EventLevel.Day),
    new Event('Aniversario del {https://es.wikipedia.org/wiki/Baile_de_los_cuarenta_y_uno=Baile de los Cuarenta y Uno} (México)', null, 11, day(18), EventLevel.Day),
    new Event('Día de la Comunidad Muxe (Vela de las Intrépidas)', 'Muxe', 11, day(15), EventLevel.Day),
    new Event('Día de la Libertad para Casarse (EE.UU.)', null, 2, day(12), EventLevel.Day),
    new Event('Día de la Prueba del VIH en Personas Transgénero (EE.UU.)', 'Transgender', 4, day(18), EventLevel.Day),
    new Event('Día de la Prueba del VIH (EE.UU.)', null, 6, day(27), EventLevel.Day),
    new Event('Día de Concientización sobre el VIH/SIDA entre las Personas de Raza Negra (EE.UU.)', null, 2, day(7), EventLevel.Day),
    new Event('Día de Concientización sobre el VIH/SIDA entre los Hombres Gais (EE.UU.)', null, 9, day(27), EventLevel.Day),
    new Event('Día de Concientización sobre el VIH/SIDA y el Envejecimiento (EE.UU.)', null, 9, day(18), EventLevel.Day),
    new Event('Día de la Conciencia de los Centros de la Comunidad LGBT (EE.UU.)', null, 10, day(19), EventLevel.Day),
    new Event('Día Latinx para la Concientización del SIDA (EE.UU.)', null, 10, day(15), EventLevel.Day),
    new Event('Día de Concientización sobre el VIH/SIDA entre los Jóvenes (EE.UU.)', null, 4, day(10), EventLevel.Day),
    new Event('Día de Concientización sobre el VIH/SIDA entre las Mujeres y Niñas (EE.UU.)', null, 3, day(10), EventLevel.Day),
    new Event('Día de Concientización para los Sobrevivientes a Largo Plazo del VIH (EE.UU.)', null, 6, day(5), EventLevel.Day),
    new Event('Día de la Visibilidad Trans-, Travesti y No Binarie (Paraguay)', 'Transgender', 10, day(15), EventLevel.Day, ['transgender']),

    // one-off events
    new Event('{https://www.facebook.com/marchadelorgulloar/=Marcha del Orgullo Buenos Aires} (Argentina)', 'LGBTQ', 11, dayYear(6, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/marchaporladiversidad.uy=Marcha por la Diversidad} (Uruguay)', 'LGBTQ', 9, dayYear(24, 2021), EventLevel.Day),
];
