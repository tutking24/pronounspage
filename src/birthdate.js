const today = new Date();
const minBirthdate = new Date(1900, 0, 1);
const maxBirthdate = new Date(today.getFullYear() - parseInt(process.env.MIN_AGE), today.getMonth(), today.getDate())

module.exports = {
    minBirthdate,
    maxBirthdate,
    formatDate(bd) {
        if (!bd) { return null; }
        if (typeof(bd) === 'string') { return bd; }
        return `${bd.getFullYear()}-${('0' + (bd.getMonth() + 1)).slice(-2)}-${('0' + bd.getDate()).slice(-2)}`;
    },
    parseDate(bd) {
        if (typeof(bd) !== 'string') { return bd; }
        return new Date(
            parseInt(bd.substring(0, 4)),
            parseInt(bd.substring(5, 7)) - 1,
            parseInt(bd.substring(8, 10))
        )
    }
}
