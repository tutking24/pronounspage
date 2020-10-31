import jwt from './jwt';

export default ({headers: { authorization }}) => {
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return null;
    }

    return jwt.validate(authorization.substring(7));
}
