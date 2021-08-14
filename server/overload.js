const overloadPeriods = {
    // en: [[15, 24]],
    // pl: [[0, 24]],
};

module.exports = (locale, timestamp = new Date) => {
    if (overloadPeriods[locale] === undefined) {
        return false;
    }

    for (let [periodStart, periodEnd] of overloadPeriods[locale]) {
        if (timestamp.getUTCHours() >= periodStart && timestamp.getUTCHours() < periodEnd) {
            return true;
        }
    }

    return false;
}
