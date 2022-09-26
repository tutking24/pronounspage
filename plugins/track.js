function defaultHandler({plausible, to, from}) {
    // console.debug("[analytics] Tracking default handler");
    plausible.trackPageview()
}
function eventHandler(eventName) {
    return function ({plausible, to, from}) {
        plausible.trackEvent(eventName, {}, {});
    }
}

const TRACKER_OVERRIDES = [
    {
        test(v) {
            return /^\/@.+/.test(v);
        },
        handling: eventHandler('Profile view')
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
                console.debug("[analytics] Page is blocked from tracking");
            } else if (typeof trackerOverride.handling === "function") {
                handler = trackerOverride.handling;
            } else {
                throw new Error("Tracking override handling is invalid");
            }
            break;
        }

        // console.log("[analytics] Tracking pageview")
        try {
            handler({plausible, to, from});
        } catch (e) {
            console.error("Error whilst trying to handle navigation: %O", e);
        }
    })
}

export default plugin;