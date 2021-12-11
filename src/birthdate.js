const today = new Date();
const minBirthdate = new Date(1900, 0, 1);
const maxBirthdate = new Date(today.getFullYear()-13, today.getMonth(), today.getDate())

module.exports = {
    minBirthdate,
    maxBirthdate,
    formatDate(bd) {
        return `${bd.getFullYear()}-${('0' + (bd.getMonth() + 1)).slice(-2)}-${('0' + bd.getDate()).slice(-2)}`;
    },
    parseDate(bd) {
        return new Date(
            parseInt(bd.substring(0, 4)),
            parseInt(bd.substring(5, 7)) - 1,
            parseInt(bd.substring(8, 10))
        )
    }
}
