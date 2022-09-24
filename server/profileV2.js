const opinions = {
    'yes': 1,
    'jokingly': 2,
    'close': 3,
    'meh': 0,
    'no': -1,
}

const upgradeOpinionsListToV2 = (opinionsListV1) => {
    return Object.entries(opinionsListV1).map(([value, opinion]) => {
        return { value, opinion: Object.keys(opinions).find(key => opinions[key] === opinion) };
    });
}

const downgradeOpinionsListToV1 = (opinionsListV2) => {
    const opinionsListV1 = {};
    for (let {value, opinion} of opinionsListV2) {
        opinionsListV1[value] = opinions[opinion];
    }
    return opinionsListV1;
}

const upgradeCustomFlagsListToV2 = (customFlagListV1) => {
    return Object.entries(customFlagListV1).map(([value, name]) => {
        return { value, name };
    });
}

const downgradeCustomFlagsToV1 = (customFlagListV2) => {
    const customFlagListV1 = {};
    for (let {value, name} of customFlagListV2) {
        customFlagListV1[value] = name;
    }
    return customFlagListV1;
}

module.exports.upgradeToV2 = (profileV1) => {
    return {
        ...profileV1,
        names: upgradeOpinionsListToV2(profileV1.names),
        pronouns: upgradeOpinionsListToV2(profileV1.pronouns),
        words: profileV1.words.map(column => {
            return {'header': null, 'values': upgradeOpinionsListToV2(column)};
        }),
        customFlags: upgradeCustomFlagsListToV2(profileV1.customFlags),
    };
}

module.exports.downgradeToV1 = (profileV2) => {
    console.log(profileV2);
    return {
        ...profileV2,
        names: downgradeOpinionsListToV1(profileV2.names),
        pronouns: downgradeOpinionsListToV1(profileV2.pronouns),
        words: profileV2.words.map(({values}) => {
            return downgradeOpinionsListToV1(values);
        }),
        customFlags: downgradeCustomFlagsToV1(profileV2.customFlags),
    };
}
