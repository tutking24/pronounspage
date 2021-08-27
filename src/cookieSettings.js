const inAYear = new Date();
inAYear.setFullYear(inAYear.getFullYear() + 1);

export default {
    secure: process.env.NODE_ENV === 'production',
    expires: inAYear,
}
