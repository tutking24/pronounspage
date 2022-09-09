import {fallbackAvatar, gravatar, now} from "../src/helpers";
import SQL from "sql-template-strings";


const fromPayload = (payloadJson) => {
    const payload = JSON.parse(payloadJson);
    return payload.avatarCopy || payload.avatar;
}

export default async (db, user) => {
    if (user.avatarSource && user.avatarSource.startsWith('https://')) {
        return user.avatarSource;
    } else if (user.avatarSource === 'gravatar') {
        return gravatar(user);
    } else if (user.avatarSource) {
        if (user.payload) {
            return fromPayload(user.payload);
        }
        const auth = await db.get(SQL`
            SELECT payload FROM authenticators
            WHERE type = ${user.avatarSource}
            AND userId = ${user.id}
            AND (validUntil IS NULL OR validUntil > ${now()})
        `)
        if (auth) {
            return fromPayload(auth.payload);
        }
    }

    return fallbackAvatar(user);
}
