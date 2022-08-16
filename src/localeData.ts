// TODO(96): Make this thing a proxy for all the data previously provided by the 'data' directory
// const zConfig = global.$zRouterData();
import type { RouterData } from "~/router/constants";
import * as util from 'util';

let zConfig: RouterData = null;
const globalAny = global as any;
if (globalAny.$zRouterData || globalAny.zRouterData) {
    zConfig = globalAny.$zRouterData ? globalAny.$zRouterData() : globalAny.zRouterData;
} else {
    //console.log("Attempt: %O", (global as Record<string, any>).$zRouterData);
    throw new Error("No config provider")
}
console.log(zConfig)
throw new Error(util.format("%O", zConfig))
//debugger;

export const MORPHEMES: any = zConfig.data.morphemes; // zConfig.data.morphemes;
export const GrammarTables = zConfig.data.grammarTables;
export const {
    pronounsRaw,
    examplesRaw,
    nounTemplatesRaw,
    pronounGroupsRaw,
    peopleRaw,
    nounDeclensionTemplatesRaw,
    abbreviationsRaw
} = zConfig.data;
