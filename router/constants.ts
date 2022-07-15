import { NuxtRouteConfig } from "@nuxt/types/config/router";

export interface RouterData {
    routes: NuxtRouteConfig[];
    locale: string;
    config: any;
    translations: any;
}

export const key = "$zaimki_routerData" as const;

declare global {
    namespace NodeJS {
        interface Global {
            $zRouterData(): RouterData;
        }
    }
}