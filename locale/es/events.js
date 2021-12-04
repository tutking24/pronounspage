const {Event, day, week, month, dayYear, EventLevel} = require("../../src/calendar/helpers");

module.exports = [
    // months
    new Event('Mes de la Historia LGBT (EE.UU.)', 'Progress Pride', 10, month, EventLevel.Month),
    new Event('Mes de la Diversidad (Uruguay)', 'LGBTQ', 9, month, EventLevel.Month),

    // static date
    new Event('Día de la Igualdad Matrimonial (EE.UU.)', '_hrc', 6, day(26), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (España)', '_hrc', 7, day(3), EventLevel.Day),
    new Event('Aniversario de la sanción de la Ley de Matrimonio Igualitario (Argentina)', '_hrc', 7, day(15), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Uruguay)', '_hrc', 8, day(5), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Colombia)', '_hrc', 4, day(28), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Ecuador)', '_hrc', 7, day(8), EventLevel.Day),
    new Event('Día de la Igualdad Matrimonial (Costa Rica)', '_hrc', 5, day(26), EventLevel.Day),
    new Event('Día de la Visibilidad Lésbica (Chile)', 'Lesbian', 7, day(9), EventLevel.Day, ['lesbian']),
    new Event('Día de la Visibilidad Lésbica (Argentina)', 'Lesbian', 3, day(7), EventLevel.Day, ['lesbian']),
    new Event('Día de la Visibilidad Lésbica (Paraguay)', 'Lesbian', 9, day(16), EventLevel.Day, ['lesbian']),
    new Event('Día del Activismo por la Diversidad Sexual (Argentina)', 'LGBTQ', 8, day(20), EventLevel.Day),
    new Event('Día de las Rebeldías Lésbicas', 'Lesbian_', 10, day(13), EventLevel.Day, ['lesbian']),
    new Event('Día de la Promoción de los Derechos de las Personas Trans (Argentina)', 'Transgender', 3, day(18), EventLevel.Day, ['transgender']),
    new Event('Aniversario de la Sanción de la Ley de Identidad de Género en Argentina', 'Transgender', 5, day(9), EventLevel.Day),
    new Event('Aniversario del {https://es.wikipedia.org/wiki/Baile_de_los_cuarenta_y_uno=Baile de los Cuarenta y Uno} (México)', null, 11, day(18), EventLevel.Day),
    new Event('Día de la Libertad para Casarse (EE.UU.)', '_hrc', 2, day(12), EventLevel.Day),
    new Event('Día de la Prueba del VIH en Personas Transgénero (EE.UU.)', 'Transgender', 4, day(18), EventLevel.Day, ['aids', 'transgender']),
    new Event('Día  Nacional de la Prueba del VIH (España)', '_red-ribbon', 10, day(20), EventLevel.Day, ['aids']),
    new Event('Día  Nacional de la Prueba del VIH (México)', '_red-ribbon', 11, day(23), EventLevel.Day, ['aids']),
    new Event('Día  Nacional de la Prueba del VIH (Perú)', '_red-ribbon', 6, day(10), EventLevel.Day, ['aids']),
    new Event('Día de Concientización sobre el VIH/SIDA entre las Personas de Raza Negra (EE.UU.)', '_red-ribbon', 2, day(7), EventLevel.Day, ['aids']),
    new Event('Día de Concientización sobre el VIH/SIDA entre los Hombres Gais (EE.UU.)', '_red-ribbon', 9, day(27), EventLevel.Day, ['aids', 'gay']),
    new Event('Día de Concientización sobre el VIH/SIDA y el Envejecimiento (EE.UU.)', '_red-ribbon', 9, day(18), EventLevel.Day, ['aids']),
    new Event('Día de la Conciencia de los Centros de la Comunidad LGBT (EE.UU.)', null, 10, day(19), EventLevel.Day),
    new Event('Día Latinx para la Concientización del SIDA (EE.UU.)', '_red-ribbon', 10, day(15), EventLevel.Day, ['aids']),
    new Event('Día de Concientización sobre el VIH/SIDA entre los Jóvenes (EE.UU.)', '_red-ribbon', 4, day(10), EventLevel.Day, ['aids']),
    new Event('Día de Concientización sobre el VIH/SIDA entre las Mujeres y Niñas (EE.UU.)', '_red-ribbon', 3, day(10), EventLevel.Day, ['aids']),
    new Event('Día de Concientización para los Sobrevivientes a Largo Plazo del VIH (EE.UU.)', '_red-ribbon', 6, day(5), EventLevel.Day, ['aids']),
    new Event('Día de la Visibilidad Trans-, Travesti y No Binarie (Paraguay)', 'Transgender', 10, day(15), EventLevel.Day, ['transgender', 'travesti', 'nonbinary']),
    new Event('Día de Concienciación de las Mujeres, Niñas y Personas Indígenas de Dos Espíritus Desaparecidas y Asesinadas', 'Two Spirit', 5, day(5), EventLevel.Day, ['two spirit']),
    new Event('Día de la Conciencia de Personas de Dos Espíritus', 'Two Spirit', 7, day(11), EventLevel.Day, ['two spirit']),
    new Event('Día Nacional de lucha contra el VIH/SIDA (Uruguay)', '_red-ribbon', 7, day(29), EventLevel.Day, ['aids']),
    new Event('Día nacional por la NO violencia y homofobia contra la población LGBTI (Colombia)', null, 8, day(23), EventLevel.Day, ['homophobia', 'transphobia', 'biphobia']),
    new Event('Día por los Derechos de las Personas LGBTI (Paraguay)', 'LGBTQ', 9, day(30), EventLevel.Day, ['lgbtq']),
    new Event('Día Contra los Crímenes de Odio (Perú)', null, 5, day(31), EventLevel.Day, ['homophobia', 'transphobia', 'biphobia']),

    // one-off events
    new Event('{https://www.facebook.com/marchadelorgulloar/=Marcha del Orgullo Buenos Aires} (Argentina)', 'LGBTQ', 11, dayYear(6, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/marchaporladiversidad.uy=Marcha por la Diversidad} (Uruguay)', 'LGBTQ', 9, dayYear(24, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/396902965304865/=15 Marcha del Orgullo Rosario} (Argentina)', 'LGBTQ', 10, dayYear(30, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/MarchaDelOrgulloChubut/=Marcha del Orgullo Chubut} (Argentina)', 'LGBTQ', 11, dayYear(27, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/marchalgbtiquilmes/=Marcha del Orgullo LGBTI de Quilmes} (Argentina)', 'LGBTQ', 10, dayYear(30, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/boqueronorgullo/=Marcha del Orgullo Boquerón} (Puerto Rico)', 'LGBTQ', 10, dayYear(10, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/OrgulloPergamino/=Marcha del Orgullo Pergamino} (Argentina)', 'LGBTQ', 12, dayYear(5, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/UnitedPartyCordoba/=Marcha del Orgullo de Córdoba} (Argentina)', 'LGBTQ', 11, dayYear(6, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/Orgullo-Arrecifes-105703395107267/=Marcha del Orgullo Arrecifes} (Argentina)', 'LGBTQ', 11, dayYear(20, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/2979887162329004/=Marcha del Orgullo LGBTI+ de Guadalajara} (México)', 'LGBTQ', 6, dayYear(11, 2022), EventLevel.Day),
];
