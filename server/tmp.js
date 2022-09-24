require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
//const copyAvatar = require('./avatarCopy');
const { upgradeToV2, downgradeToV1 } = require('./profileV2');

(async () => {
    const db = await dbConnection();

    const profiles = await db.all(SQL`SELECT * FROM profiles WHERE profiles.customFlags LIKE '{%'`);
    let i = 0;
    for (let profile of profiles) {
        if (i % 1000 === 0) {
            console.log(`${i}/${profiles.length}`);
        }
        i++;

        await db.get(SQL`UPDATE profiles
            SET 
                customFlags = ${JSON.stringify(Object.values(profile.customFlags))}
            WHERE id = ${profile.id}
        `);
    }

    //const x = {"0":{"value":"01GBR0T0V2XPFZ5P140X6DHT57","name":"pinkcatgender"},"1":{"value":"01GBR0SVPDB5P62S1ZVRRTAFXE","name":"angelcatic"},"2":{"value":"01GBR0TDGWJ8TFEDX9H82ERJQ3","name":"starcatgirlgender"},"3":{"value":"01GBR0TSKXHRJQ2J6XBVWE2CZB","name":"fluffcattic"},"4":{"value":"01GBR0TXMR81E9JA97X6AQYB37","name":"ghostcatgender"},"5":{"value":"01GBR0V1M3HRT9R59708GZ13C0","name":"lolitacatgender"},"6":{"value":"01GBR0XMT99MC0SV3RF87ZF24H","name":"starrycatgender"},"7":{"value":"01GBR0X6ZDW7D9YQPGMWZ4XD7C","name":"gentillecatgender"},"8":{"value":"01GBR0VXAHCWGHJ66H6600ZYCQ","name":"dollicattic"},"9":{"value":"01GBR0XB7X8EBPFMMXGH9W19D4","name":"cutethinggender"},"10":{"value":"01GBS44MYS3W1JBH8YVGB8H70M","name":"lovesickcatgender"},"11":{"value":"01GBR0XF6PMDADXT4A4HJ3JZJH","name":"gorecatbatic"},"12":{"value":"01GBR0XSCSCAFM9RQ0527S1Z6A","name":"vampcatgender"},"13":{"value":"01GBTRC347J2CRN1XB4XBVWV6G","name":"felihorroren"},"14":{"value":"01GC044T8HE1JF0X9DG3V2F67M","name":"unholything"},"15":{"value":"01GBR0VSFT469ZGZR6Y8NCVKR7","name":"bloodkawaiic"},"16":{"value":"01GBTS47HYX72XWFYDBPQ5R2WS","name":"bloodyknifegender"},"17":{"value":"01GC044V3QES24YXDEBDDFHK57","name":"murderthing"},"18":{"value":"01GC044TVXER7WJ5ACV022MS0M","name":"bloodcoric"},"19":{"value":"01GC92HPX4ETVDYTJVE55843HB","name":"bloodaesic"},"20":{"value":"01GC92HQ2VP5RE3D08ERW7D9VY","name":"gorehoarder"},"21":{"value":"01GC044V9QFNH3HZTH6W38PXDZ","name":"dollgorea"},"22":{"value":"01GC044TNQ09MDJSB4T49PPBSS","name":"gorecoric"},"23":{"value":"01GC92HHBD5KK4G8RKKVAQ5JJZ","name":"gorigender"},"24":{"value":"01GC044VXV14DZC7PWYGZSNMRF","name":"crypilexic"},"25":{"value":"01GBTS4EN5E16H471FBQPSDYPE","name":"bloodcatgender"},"26":{"value":"01GBTS4J1SWHNM739ZGKHE72KG","name":"grotesquelexic"},"27":{"value":"01GC044TE44MGPA7MJ8PX3DRST","name":"bloodmaidgender"},"28":{"value":"01GC044VQ4T6Z2FWXGA4YVCMSR","name":"dentalatic"},"29":{"value":"01GBR0X33103MV9VKTVQ4H315R","name":"yanderecoric"},"30":{"value":"01GC4ETKSSKDGAPT8F0ZTGDDXQ","name":"menherachangender "},"31":{"value":"01GBR0VEK5WJDXNA1W76TGM6F4","name":"menheracoric"},"32":{"value":"01GBR0VMQWMP93AY55BNG931EM","name":"menheragender"},"33":{"value":"01GBR0WJFVGQV3E7ZEJF102MT9","name":"cutevampiregender"},"34":{"value":"01GB3N5BNW36NPYM5W9JAFTTJN","name":"velvetgender"},"35":{"value":"01GBR0V68ECAM7JZD483F7WR7F","name":"mochipawgender"},"36":{"value":"01GBR0SK5ATMWJ8A4QEH4X4KGX","name":"lumicattic"},"37":{"value":"01GBR0T476202GTQKS9B4SQXKH","name":"dollgender"},"38":{"value":"01GBR0TJ7ZRHE9TGXK1YHSPY4H","name":"lovecoric"},"39":{"value":"01GBR0TP5379HAXHPHWRXDPMEP","name":"dovehoarder"},"40":{"value":"01GBR0VADB9DRCVDCNY0WWHK5X","name":"maidcoric/maidgender"},"41":{"value":"01GBS44RAJPGEX3CW3WMNEGYBP","name":"pastelpinkmaidcoric"},"42":{"value":"01GBR0W21G7ZR6M5KQW0P8WKA6","name":"genderplush"},"43":{"value":"01GBR0W87QBRVD9MYB300C944R","name":"fwufilovi"},"44":{"value":"01GBR0WESTWXD062HG7V5ZJ583","name":"lemoncakegender"},"45":{"value":"01GBR0WPT3X0XPYEHYAM0WE5WY","name":"lumipinkstaric"},"46":{"value":"01GBR0WTST19XZ1QEJ3RDSJQ4R","name":"comfnightgender"},"47":{"value":"01GBR5XDBER4V53E9BKR2M3Z2W","name":"moonic"},"48":{"value":"01GBR0WYXGW8HXGCJCJR3YW5B8","name":"multiverocusgender"},"49":{"value":"01GBR0Y68Q85B270CGC26GBXQ1","name":"lunaponyic"},"50":{"value":"01GBR0XY0G7WCM7X4HR541HYV8","name":"fluttershygender"},"51":{"value":"01GBR0Y26YWR0VX2ZXJ9EQGXGC","name":"fluttersgalic"},"52":{"value":"01GBTRBYZY6DVYAG2ERM796J3P","name":"gendershopping"},"53":{"value":"01GBTS4N5FP8HBKWRRX30FYW1E","name":"dragoncatgender"},"54":{"value":"01GBTS4RV3KGV9S9Y0SKFQGVVG","name":"twilic"},"55":{"value":"01GBTS4WWF9EBGK76Y2NCX69AD","name":"auroralupincryin"},"56":{"value":"01GBTS50A5C9DN5BSK3XFT4RXN","name":"negativeslimecatgender"},"57":{"value":"01GBTS57V3E4AW3YZ50N4N6YQ3","name":"shadowingcatgender"},"58":{"value":"01GBTS5BT8865YD7H98WPGG7P4","name":"batdollicattic"},"59":{"value":"01GBTS5F6VFEHNSN9MTFNRYB5J","name":"aesthetiflux "},"60":{"value":"01GC044VFQY8DMSGMSR75G6AER","name":"xenoeyxis"},"61":{"value":"01GCHASQDGR5Z6MAWV1C2D7FV6","name":"patheticbeing"},"62":{"value":"01GCHCG5ADTD8DTCE0T65XY93S","name":"sewerslvtcoric "},"63":{"value":"01GCHD6C1WG0AQ0XREJBPD8SD2","name":"sicktwisteddementedic "},"64":{"value":"01GCSV8GARDDS53FR877G390SP","name":"goofygender"},"65":{"value":"01GCSV8GQ0BY655VJ86Q4SQ04K","name":"typingquirkic"},"66":{"value":"01GCSV8GWGTM6KFGWA2M7Z7DJB","name":"heartquarosic"},"67":{"value":"01GCSV8H3F84VMEAVD6KE44H10","name":"vocasakuraen"},"68":{"value":"01GCSV8HB18S8T9FFYXM1K7S3W","name":"orangejuicegender "},"69":{"value":"01GCSV8HGBEVEK772FGW91650Y","name":"cemeterian"},"70":{"value":"01GCSVDVAYZCYXNFQFCBGVZFH1","name":"cupcakesic"},"71":{"value":"01GCSVDVKANWV2BMCXP8KDZT52","name":"linistornia"},"72":{"value":"01GCSVDVTTJBEZ9H53TG3XZBPM","name":"dolunaesic"},"73":{"value":"01GCSVDW1NYKWH6ANSSP55WENF","name":"sourcandygender"},"74":{"value":"01GCSVDW8G020NWQMNSFES7SEY","name":"catcutteric"},"75":{"value":"01GCSVDWGTT44R783PCGEK8R2N","name":"pinkraincloudic"},"76":{"value":"01GCSVDWQ993D3CCA65ZZWN8QD","name":"lolitamenheric"},"77":{"value":"01GCSVDWWHCGESDZHYBH07FEMQ","name":"cutiekillen"},"78":{"value":"01GD5ADNCYEQT93MC851NYVMNJ","name":"ademonlector"},"79":{"value":"01GD5ADNNG1HEQ28TDRQSWBZ3R","name":"demongender"},"80":{"value":"01GD5AHMKNZ1YPQVKEFWRDGET6","name":"cealokaic "},"81":{"value":"01GD8SYSAJTKXQ8MB395XJFZW5","name":"ISCFYgender"},"82":{"value":"01GD8SYSHQ7C84TPB8R10QYPJC","name":"goreself pronouns "},"83":{"value":"01GD8SZ1G79X8YNQPCB1XKKKZ2","name":"sotekittian"},"84":{"value":"01GD8SZ8H00TMS926ZZGKD3VNT","name":"banblodaidix"}};
    const x = {};
    const y = Object.values(x);
    console.log(y)
    console.log(JSON.stringify(y));
    return;

    // const db = await dbConnection();
    //
    // const profiles = await db.all(SQL`SELECT * FROM profiles WHERE names LIKE '{%'`);  //  WHERE userId = ${'01EMPVS2T10S9X0440N47WF8N2'} AND locale = ${'pl'}
    // let i = 0;
    // for (let profile of profiles) {
    //     if (i % 1000 === 0) {
    //         console.log(`${i}/${profiles.length}`);
    //     }
    //     i++;
    //
    //     const profileV1 = {
    //         ...profile,
    //         names: JSON.parse(profile.names),
    //         pronouns: JSON.parse(profile.pronouns),
    //         words: JSON.parse(profile.words),
    //         customFlags: JSON.parse(profile.customFlags),
    //     }
    //     const profileV2 = upgradeToV2(profileV1);
    //
    //     await db.get(SQL`UPDATE profiles
    //         SET
    //             names = ${JSON.stringify(profileV2.names)},
    //             pronouns = ${JSON.stringify(profileV2.pronouns)},
    //             words = ${JSON.stringify(profileV2.words)},
    //             customFlags = ${JSON.stringify(profileV2.customFlags)}
    //         WHERE id = ${profileV2.id}
    //     `);
    //
    //     // console.log(profileV1);
    //     // const profileV2 = upgradeToV2(profileV1);
    //     // profileV2.names.push({value: 'test', opinion: '🙈'});
    //     // console.log(profileV2);
    //     // const profileV1Restored = downgradeToV1(profileV2);
    //     // console.log(profileV1Restored);
    //     // console.log('---')
    // }


    // const now = parseInt(+new Date / 1000);
    // const auths = await db.all(SQL`
    //     SELECT * FROM authenticators
    //     WHERE type IN ('mastodon', 'indieauth', 'twitter', 'discord', 'google', 'facebook')
    //         AND (validUntil IS NULL OR validUntil > ${now})
    // `)
    // let i = 0;
    // for (let auth of auths) {
    //     console.log(`${i++}/${auths.length} ${auth.userId} (${auth.type})`);
    //     const payload = JSON.parse(auth.payload);
    //     if (payload.avatarCopy || !payload.avatar) { continue; }
    //     const copyUrl = await copyAvatar(auth.type, payload.avatar);
    //     console.log(copyUrl);
    //     if (copyUrl) {
    //         payload.avatarCopy = copyUrl;
    //         await db.get(SQL`UPDATE authenticators SET payload = ${JSON.stringify(payload)} WHERE id = ${auth.id}`);
    //     }
    // }
})();

// require('../src/dotenv')();
// const mailer = require('../src/mailer');
//
// mailer('andrea@avris.it', 'inactivityWarning', {username: 'foo'});

/*
require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');

async function run() {
    const db = await dbConnection();

    const opinions = {
        '-1': 0,
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
    };

    let i = 0;
    const chunk = 10000;
    while (true) {
        console.log(i);
        const profiles = await db.all(SQL`SELECT * FROM profiles WHERE locale = 'en' AND birthday IS NOT NULL AND birthday > '2002-08-09' LIMIT ${chunk} OFFSET ${i};`)
        if (profiles.length === 0) { break; }
        i += chunk;

        for (let profile of profiles) {
            for (let words of JSON.parse(profile.words)) {
                for (let [word, opinion] of Object.entries(words)) {
                    if (word === 'enby') {
                        opinions[opinion.toString()]++;
                    }
                }
            }
        }
    }

    console.log(opinions);
}

run();

// const fetch = require('node-fetch');
//
// apiKey = ''
// async function main() {
//     const res = await fetch(`https://plausible.avris.it/api/v1/stats/aggregate?site_id=${'en.pronouns.page'}&period=30d&metrics=visitors,pageviews`, {
//         headers: {
//             'Authorization': `Bearer ${apiKey}`,
//         }
//     });
//     console.log(await res.json());
// }
// main();

/*
require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
const fs = require('fs');
const Suml = require('suml');

const translations = {};

async function update(flag) {
    const db = await dbConnection();

    let count = 0;
    for (let {id, locale, flags, customFlags} of await db.all(SQL`SELECT id, locale, flags, customFlags FROM profiles WHERE flags like ${'%"' + flag + '"%'}`)) {
        if (translations[locale] === undefined) {
            translations[locale] = new Suml().parse(fs.readFileSync(`./locale/${locale}/translations.suml`).toString())
        }

        flags = JSON.parse(flags);
        customFlags = JSON.parse(customFlags);

        let translation = translations[locale].flags;
        translation = translation === undefined ? flag : translation[flag];
        translation = translation.replace(/{.*?}/g, '_');

        flags = flags.filter(f => f !== flag);
        customFlags = {
            '01FHY8BWGFWXHF71F00GS8RGW2': translation,
            ...customFlags,
        };

        await db.get(SQL`UPDATE profiles SET flags = ${JSON.stringify(flags)}, customFlags = ${JSON.stringify(customFlags)} WHERE id = ${id};`)
        count++;
    }
    console.log('Updated', flag, count);
}

update('Monoamorous'); // TODO
update('Monogamous'); // TODO
*/
