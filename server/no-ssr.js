import isHighLoadTime from './overload';

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

export default function(req, res, next) {
    if (process.env.NODE_ENV === 'production' && !req.url.startsWith('/card/@')) {
        console.log(req.url); // TODO remove later
        res.spa = isBrowser(req.headers['user-agent']) || isHighLoadTime(process.env.LOCALE);
    }
    next();
}
