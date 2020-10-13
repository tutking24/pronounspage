import jwt from 'jsonwebtoken';
import fs from 'fs';

class Jwt {
    constructor(privateKey, publicKey) {
        this.privateKey = fs.readFileSync(privateKey);
        this.publicKey = fs.readFileSync(publicKey);
    }

    sign(payload, expiresIn = '30d') {
        return jwt.sign(payload, this.privateKey, {
            expiresIn,
            algorithm: 'RS256',
            audience: process.env.BASE_URL,
            issuer: process.env.BASE_URL,
        });
    }

    validate(token) {
        try {
            return jwt.verify(token, this.publicKey, {
                algorithm: 'RS256',
                audience: process.env.BASE_URL,
                issuer: process.env.BASE_URL,
            });
        } catch (e) {
            console.error(e);
        }
    }
}

export default new Jwt(__dirname + '/../keys/private.pem', __dirname + '/../keys/public.pem');
