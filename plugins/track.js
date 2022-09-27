function defaultHandler({plausible, to, from}) {
    // console.debug("[analytics] Tracking default handler");
    plausible.trackPageview()
}
function eventHandler(eventName) {
    return function ({plausible, to, from}) {
        plausible.trackEvent(eventName, {}, {});
    }
}
/**
 * @param {(value: string) => string} redactor
 * @param {(ctx) => void} base
 * @return {(ctx) => void}
 */
function redact(redactor, base = defaultHandler) {
    return (ctx) => base({
        ...ctx,
        to: redactor(ctx)
    })
}

const TRACKER_OVERRIDES = [
    {
        test(v) {
            return /^\/@.+/.test(v);
        },
        handling: redact((v) => {
            const parts = v.split('/').filter((v) => v.length > 0);
            for (const i in parts) { // NOTE(tecc): This might be overengineering but that's fine
                const part = parts[i];
                if (/^@.+$/.test(part)) {
                    parts[i] = '@--redacted--';
                }
            }
            return '/' + parts.join('/');
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
                console.debug("[analytics] Page is blocked from tracking");
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
            handler({plausible, to, from});
        } catch (e) {
            console.error("Error whilst trying to handle navigation: %O", e);
        }
    })
}

export default plugin;