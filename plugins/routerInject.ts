import { Plugin } from "@nuxt/types";
import { RouterData, key } from "~/router/constants";



export const plugin: Plugin = function ({app, ssrContext, beforeNuxtRender, nuxtState}, inject) {
    /*
     * This file computes all necessary router data to pass to the router plugin on the backend and frontend
     */

    let routerData: RouterData = $zRouterData();
    if (process.server) {
        beforeNuxtRender(({ nuxtState }) => {
            nuxtState[key] = routerData;
        })
    } else {
    }
    console.log("Injecting pRouterData");
    inject('zRouterData', () => routerData);
}

export default plugin;