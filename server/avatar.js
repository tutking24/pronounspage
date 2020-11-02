import {gravatar, now} from "../src/helpers";
import SQL from "sql-template-strings";

export default async (db, user) => {
    if (user.avatarSource) {
        const auth = await db.get(SQL`
            SELECT payload FROM authenticators
            WHERE type = ${user.avatarSource}
            AND userId = ${user.id}
            AND (validUntil IS NULL OR validUntil > ${now()})
        `)
        if (auth) {
            return JSON.parse(auth.payload).avatar;
        }
    }

    return gravatar(user);
}
