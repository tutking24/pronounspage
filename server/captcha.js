import fetch from 'node-fetch';

export const validateCaptcha = async (token) => {
    const res = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: `response=${encodeURIComponent(token)}&secret=${encodeURIComponent(process.env.HCAPTCHA_SECRET)}`
    });
    const body = await res.json();
    return body['success'];
}
