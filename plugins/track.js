function defaultHandler({plausible, to, from}) {
    console.debug("[analytics] Tracking default handler: %O", to);
    plausible.trackPageview({
        url: to.toString()
    })
}
function eventHandler(eventName) {
    return function ({plausible, to, from}) {
        plausible.trackEvent(eventName, {}, {});
    }
}
/**
 * @param {(value: URL) => URL} redactor
 * @param {(ctx) => void} base
 * @return {(ctx) => void}
 */
function redact(redactor, base = defaultHandler) {
    return (ctx) => base({
        ...ctx,
        to: redactor(ctx.to)
    })
}

const USER_AT = /^\/@.+/;
const USER_SUBPAGE = /^\/(u|card)\/.*/;

const TRACKER_OVERRIDES = [
    {
        test(v) {
            return USER_AT.test(v) || USER_SUBPAGE.test(v);
        },
        handling: redact((v) => {
            let pathname = v.pathname;
            if (USER_AT.test(pathname)) {
                pathname = pathname.replace(USER_AT, '/@--redacted--')
            }
            if (USER_SUBPAGE.test(pathname)) {
                pathname = pathname.replace(USER_SUBPAGE, '/$1/--redacted--');
            }
            v.pathname = pathname;
            return v;
        })
    }
]

export const plugin = function ({app}) {
    const plausible = app.$plausible;

    app.router.afterEach((to, from) => {
        let handler = defaultHandler;
        for (const trackerOverride of TRACKER_OVERRIDES) {
            if (!trackerOverride.test(to.fullPath)) {
                continue;
            }

            if (trackerOverride.handling === false) {
                // console.debug("[analytics] Page is blocked from tracking");
                return;
            } else if (typeof trackerOverride.handling === "function") {
                handler = trackerOverride.handling;
            } else {
                throw new Error("Tracking override handling is invalid");
            }
            break;
        }

        // console.log("[analytics] Tracking pageview")
        try {
            handler({
                plausible,
                to: new URL(to.fullPath, window.location.href),
                from: new URL(from.fullPath, window.location.href)
            });
        } catch (e) {
            console.error("Error whilst trying to handle navigation: %O", e);
        }
    })
}

export default plugin;