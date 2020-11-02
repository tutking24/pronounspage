import jwt from './jwt';

export default ({cookies, headers}) => {
    if (headers.authorization && headers.authorization.startsWith('Bearer ')) {
        return jwt.validate(headers.authorization.substring(7));
    }

    if (cookies.token && cookies.token !== 'null') {
        return jwt.validate(cookies.token)
    }

    return null;
}
