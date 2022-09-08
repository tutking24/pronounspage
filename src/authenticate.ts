import jwt from './jwt';
import type { Request } from "express";
import type { Jwt, JwtPayload } from "jsonwebtoken";

// TODO: Typings for the user properties
export type RawUser = Jwt & JwtPayload;
export default ({cookies, headers}: Request): RawUser | undefined => {
    if (headers.authorization && headers.authorization.startsWith('Bearer ')) {
        return jwt.validate(headers.authorization.substring(7)) as RawUser;
    }

    if (cookies.token && cookies.token !== 'null') {
        return jwt.validate(cookies.token) as RawUser;
    }

    return undefined;
}
