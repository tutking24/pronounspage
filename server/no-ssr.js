const USER_AGENT_BOTS = /bot|crawler|baiduspider|80legs|ia_archiver|voyager|curl|wget|yahoo! slurp|mediapartners-google|facebookexternalhit|twitterbot|whatsapp|php|python/;
const USER_AGENT_BROWSERS = /mozilla|msie|gecko|firefox|edge|opera|safari|netscape|konqueror|android/;

const isBrowser = (userAgent) => {
    if (!userAgent) {
        return false;
    }
    const isProbablyBot = !!userAgent.toLowerCase().match(USER_AGENT_BOTS);
    const isProbablyBrowser = !!userAgent.toLowerCase().match(USER_AGENT_BROWSERS);

    return isProbablyBrowser || !isProbablyBot;
}

const overload = {
    en: [[17, 23]],
};

const isHighLoad = (timestamp, overloadPeriods) => {
    if (overloadPeriods === undefined) {
        return false;
    }

    for (let [periodStart, periodEnd] of overloadPeriods) {
        if (timestamp.getUTCHours() >= periodStart && timestamp.getUTCHours() < periodEnd) {
            return true;
        }
    }

    return false;
}

export default function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        res.spa = isBrowser(req.headers['user-agent']) || isHighLoad(new Date, overload[process.env.LOCALE]);
    }
    next();
}
