// TODO(96): Make this thing a proxy for all the data previously provided by the 'data' directory
// const zConfig = global.$zRouterData();
const zConfig = null;
console.log(global);
//debugger;

export const MORPHEMES: any = zConfig.data.morphemes;
export const {
    pronounsRaw,
    examplesRaw,
    nounTemplatesRaw,
    pronounGroupsRaw,
    peopleRaw,
    nounDeclensionTemplatesRaw,
    abbreviationsRaw
} = zConfig.data;
