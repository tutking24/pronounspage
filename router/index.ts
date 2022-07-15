import Vue from 'vue';
import Router from 'vue-router';
import type NuxtRouter from '@nuxtjs/router';
import languagesStrict from './languages.json';
import { Context } from "@nuxt/types";
import { key, RouterData } from "~/router/constants";
import { NuxtState } from "@nuxt/types/app";
import { NuxtRouteConfig } from "@nuxt/types/config/router";
import path from 'path';
import { AsyncComponent } from "vue";

Vue.use(Router);

const languages: Record<string, string> = languagesStrict;

function resolveLocale(ssrContext: Context, host: string): string {
    if (ssrContext) {
        const url = new URL(`http://${host}`);

        const hostname = url.hostname;
        return languages[hostname] || '_';
    }
}

function resolve(...segments: string[]): string {
    return segments.join('/');
    const dirname = __dirname || '~';
    // const resolved = path.resolve(dirname, '..', ...segments);
    // console.log("Dirname: %s", resolved);
    return "~/" + segments.join('/');
}

function generateRoutes(config: any) {
    let routes: NuxtRouteConfig[] = [];
    if (config.pronouns.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.pronouns.route),
            component: resolve('routes/pronouns')
        });
    }

    if (config.sources.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.sources.route),
            component: resolve('routes/sources')
        });
    }

    if (config.nouns.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.nouns.route),
            component: resolve('routes/nouns')
        });
        for (let subroute of config.nouns.subroutes || []) {
            routes.push({
                path: '/' + encodeURIComponent(subroute),
                component: resolve(`locale/${config.locale}/nouns/${subroute}`)
            });
        }
    }

    if (config.inclusive.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.inclusive.route),
            component: resolve('routes/inclusive')
        });
    }
    if (config.terminology.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.terminology.route),
            component: resolve('routes/terminology')
        });

        // TODO remove later
        routes.push({
            path: '/' + encodeURIComponent(config.nouns.route) + '/' + encodeURIComponent(config.terminology.route),
            component: resolve('routes/terminology')
        });
    }

    if (config.names.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.names.route),
            component: resolve('routes/names')
        });
    }

    if (config.faq.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.faq.route),
            component: resolve('routes/faq')
        });
    }

    if (config.links.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.links.route),
            component: resolve('routes/links')
        });
        if (config.links.academicRoute) {
            routes.push({
                path: '/' + encodeURIComponent(config.links.academicRoute),
                component: resolve('routes/academic')
            });
        }
        if (config.links.mediaRoute) {
            routes.push({
                path: '/' + encodeURIComponent(config.links.mediaRoute),
                component: resolve('routes/media')
            });
        }
    }

    if (config.links.blog) {
        routes.push({
            path: '/' + encodeURIComponent(config.links.blogRoute),
            component: resolve('routes/blog'),
            name: 'blog'
        });
        routes.push({
            path: '/' + encodeURIComponent(config.links.blogRoute) + '/:slug',
            component: resolve('routes/blogEntry'),
            name: 'blogEntry'
        });
        if (config.blog && config.blog.shortcuts) {
            for (let shortcut in config.blog.shortcuts) {
                if (!config.blog.shortcuts.hasOwnProperty(shortcut)) {
                    continue;
                }
                const slug = config.blog.shortcuts[shortcut];
                routes.push({
                    path: '/' + encodeURIComponent(shortcut),
                    component: resolve('routes/blogEntry'),
                    meta: { slug },
                    name: 'blogEntryShortcut:' + shortcut
                });
            }
        }
    }

    if (config.links.zine && config.links.zine.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.links.zine.route),
            component: resolve('routes/zine')
        });
    }

    if (config.people.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.people.route),
            component: resolve('routes/people')
        });
    }

    if (config.english.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.english.route),
            component: resolve('routes/english')
        });
    }

    if (config.contact.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.contact.route),
            component: resolve('routes/contact')
        });
    }
    if (config.contact.team.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.contact.team.route),
            component: resolve('routes/team')
        });
    }

    if (config.census.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.census.route),
            component: resolve('routes/census')
        });
        routes.push({
            path: '/' + encodeURIComponent(config.census.route) + '/admin',
            component: resolve('routes/censusModeration')
        });
    }

    if (config.user.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.user.route),
            component: resolve('routes/user')
        });
        routes.push({
            path: '/' + encodeURIComponent(config.user.termsRoute),
            component: resolve('routes/terms')
        });
    }
    routes.push({ path: '/license', component: resolve('routes/license') });
    routes.push({ path: '/admin', component: resolve('routes/admin') });
    routes.push({ path: '/admin/moderation', component: resolve('routes/adminModeration') });

    if (config.profile.enabled) {
        routes.push({ path: '/u/*', component: resolve('routes/profile') });
        routes.push({ path: '/@*', component: resolve('routes/profile') });
        routes.push({ path: '/card/@*', component: resolve('routes/profileCard') });
        if (config.profile.editorEnabled) {
            routes.push({ path: '/editor', component: resolve('routes/profileEditor') });
        }
    }

    if (config.pronouns.enabled) {
        routes.push({
            path: `/${encodeURIComponent(config.pronouns.any)}`,
            component: resolve('routes/any')
        });
        routes.push({
            path: `/${encodeURIComponent(config.pronouns.any)}::group`,
            component: resolve('routes/any')
        });
        if (config.pronouns.null && config.pronouns.null.routes) {
            for (let route of config.pronouns.null.routes) {
                routes.push({
                    path: '/' + encodeURIComponent(route),
                    component: resolve('routes/avoiding')
                });
            }
        }
        if (config.pronouns.mirror) {
            routes.push({
                path: '/' + encodeURIComponent(config.pronouns.mirror.route),
                component: resolve('routes/mirror')
            });
        }
    }

    if (config.calendar && config.calendar.enabled) {
        routes.push({
            path: '/' + encodeURIComponent(config.calendar.route),
            component: resolve('routes/calendar')
        });
        routes.push({
            path: '/' + encodeURIComponent(config.calendar.route) + '/:year(\\d\\d\\d\\d)',
            component: resolve('routes/calendar')
        });
        routes.push({
            path: '/' + encodeURIComponent(config.calendar.route) + '/:year(\\d\\d\\d\\d)-:month(\\d\\d)-:day(\\d\\d)',
            component: resolve('routes/calendarDay')
        });
    }

    if (config.api !== null) {
        routes.push({ path: '/api', component: resolve('routes/api') });
    }

    routes.push({ name: 'all', path: '*', component: resolve('routes/pronoun') });

    return routes;
}

function convertRoutes(routes: NuxtRouteConfig[]): NuxtRouteConfig[] {
    console.log(routes);
    return routes;
}

const undefault = <D>(v: { default: D }) => v.default;

function createAsyncComponent(path: string): AsyncComponent {
    return async (resolve, reject) => {
        try {
            let thing;
            if (path.startsWith('routes')) {
                // this is a hack for compile-time performance, seriously do *NOT* unwrap this if
                thing = await import(`~/routes/${path.substring(7)}.vue`).then(undefault);
            } else if (path.startsWith('locale')) {
                thing = await import(`~/locale/${path.substring(7)}.vue`)
            } else {
                throw new Error("Unsupported path " + path + " (router / caused by performance hack)")
            }
            if (resolve) resolve(thing);
            return thing;
        } catch (e) {
            if (reject) reject(e);
            throw e;
        }
    }
}

function convertRoute(config: NuxtRouteConfig): NuxtRouteConfig {
    return Object.assign({}, config, {
        component: createAsyncComponent(config.component as string)
    })
}

export async function createRouter(ssrContext: Context, createDefaultRouter: any, routerOptions: any, config: any, store: any) {
    const options = routerOptions || createDefaultRouter(ssrContext).options;
    const hostname = ssrContext ? ssrContext.req.headers.host! : location.host;
    console.log("SSR: %O, host: %s", !!ssrContext, hostname);
    const localeId = resolveLocale(ssrContext, hostname);
    let routerData: RouterData;
    if (process.server) {
        routerData = {
            locale: localeId,
            config: await import(`~/locale/${localeId}/config.suml`).then((v) => v.default),
            translations: await import(`~/locale/${localeId}/translations.suml`).then((v) => v.default)
        };
    } else {
        const nuxtState = (global as any)["__NUXT__"] as NuxtState;
        routerData = nuxtState[key];
    }
    global.$zRouterData = () => (routerData);

    const routes = generateRoutes(routerData.config).map(convertRoute);

    return new Router({
        ...options,
        routes,
    });
}