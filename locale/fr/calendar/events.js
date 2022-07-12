const {Event, day, week, month, dayYear, EventLevel, Day} = require("../../../src/calendar/helpers");

module.exports = [
    // --- months ---
    new Event('Mois de l\'histoire des LGBT (Canada/USA/Australia)', 'Progress Pride', 10, month, EventLevel.Month),

    // --- static date ---
    new Event('Journée du triangle rose (Canada)', null, 2, day(14), EventLevel.Day),
    new Event('Journée de le mariage pour tous (Canada)', '_hrc', 7, day(20), EventLevel.Day),
    new Event('Journée de le mariage pour tous (France)', '_hrc', 5, day(18), EventLevel.Day),
    new Event('Journée de le mariage pour tous (Belgique)', '_hrc', 6, day(1), EventLevel.Day),
    new Event('Journée de sensibilité à la bispiritualité', 'Two Spirit', 7, day(11), EventLevel.Day, ['two spirit']),
    new Event('Journée de sensibilisation aux femmes, aux filles et aux personnes bispirituelles autochtones disparues et assassinées (Canada/USA)', 'Two Spirit', 5, day(5), EventLevel.Day, ['two spirit']),
    new Event('Anniversaire de la décrimilisation de l\'homosexualité (Canada)', '_law', 6, day(27), EventLevel.Day),
    new Event('Journée de sensibilité à la bispiritualité (USA)', 'Two Spirit', 7, day(11), EventLevel.Day, ['two spirit']),
    new Event('Journée de célébration bispirituelle (Canada)', 'Two Spirit', 7, day(11), EventLevel.Day, ['two spirit']),

    // --- dynamic date ---

    // Third Thursday of October
    new Event('Journée d\'esprit (Canada/USA)', null, 10, function* (monthDays) {
        let thursdays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 4) {
                thursdays++;
                if (thursdays === 3) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day),

    // Dec 1 - 7
    new Event('Semaine autochtone de sensibilisation au sida (Canada)', '_red-ribbon', 12, week(function* (monthDays) {
        for (let d of monthDays) {
            if (d.day <= 7) {
                yield d;
            }
        }
    }), EventLevel.Week, ['aids']),

    // Nov 24 - Dec 1
    new Event('Semaine de sensibilité à l\'épidémie de sida (Canada)', '_red-ribbon', 11, function* (monthDays) {
        let lastDay = null;
        for (let d of monthDays) {
            if (d.day >= 24) {
                yield d;
            }
            lastDay = d;
        }
        yield new Day(lastDay.year, 12, 1);
    }, EventLevel.Week, ['aids']),

    // one-off events
    new Event('Journée de le mariage pour tous (Suisse)', '_hrc', 7, dayYear(1, 2022), EventLevel.Day),

];
