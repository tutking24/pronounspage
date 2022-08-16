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
import { generateRoutes } from "~/router/routes";

Vue.use(Router);

const languages: Record<string, string> = languagesStrict;

function resolveLocale(ssrContext: Context, host: string): string {
    if (process.server) {
        const url = new URL(`http://${host}`);

        const hostname = url.hostname;
        return languages[hostname] || '_';
    }

    throw new Error("Cannot resolve in non-server context");
}

function convertRoutes(routes: NuxtRouteConfig[]): NuxtRouteConfig[] {
    console.log(routes);
    return routes;
}

const undefault = <D>(v: { default: D }) => v.default;
const def = <T>(v: T) => (() => ({ default: v } as const));
const nodef = def(undefined);
const defarr = def([]);

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
        console.log("Processing locale %s", localeId);
        const config = await import(`~/locale/${localeId}/config.suml`).then(undefault);
        const translations = await import(`~/locale/${localeId}/translations.suml`).then(undefault);
        routerData = {
            locale: localeId,
            config,
            translations,
            routes: generateRoutes(config),
            data: {
                morphemes: await import(`~/locale/${localeId}/pronouns/morphemes.tsv`).catch(defarr).then(undefault),
                grammarTables: await import (`~/locale/${localeId}/pronouns/GrammarTables`).catch(nodef).then(undefault),
                pronounsRaw: await import(`~/locale/${localeId}/pronouns/pronouns.tsv`).catch(defarr).then(undefault),
                examplesRaw: await import(`~/locale/${localeId}/pronouns/examples.tsv`).catch(nodef).then(undefault),
                nounTemplatesRaw: await import(`~/locale/${localeId}/pronouns/nounTemplates.tsv`).catch(defarr).then(undefault),
                pronounGroupsRaw: await import(`~/locale/${localeId}/pronouns/pronounGroups.tsv`).catch(nodef).then(undefault),
                peopleRaw: await import(`~/locale/${localeId}/people/people.tsv`).catch(nodef).then(undefault),
                nounDeclensionTemplatesRaw: await import(`~/locale/${localeId}/nouns/nounDeclension.tsv`).catch(nodef).then(undefault),
                abbreviationsRaw: await import(`~/locale/${localeId}/nouns/abbr.tsv`).catch(nodef).then(undefault)
            }
        };
    } else {
        const nuxtState = (global as any)["__NUXT__"] as NuxtState;
        routerData = nuxtState[key];
    }
    global.$zRouterData = () => (routerData);

    const routes = routerData.routes.map(convertRoute);

    return new Router({
        ...options,
        routes,
    });
}
