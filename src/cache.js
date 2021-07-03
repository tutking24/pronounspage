import fs from 'fs';

export class CacheObject {
    constructor(dir, filename, maxAgeMinutes) {
        const cacheDir = `${__dirname}/../cache/${dir}`
        fs.mkdirSync(cacheDir, { recursive: true });
        this.path = `${cacheDir}/${filename}`;
        this.maxAgeMinutes = maxAgeMinutes;
    }

    async fetch(generator) {
        if (process.env.NODE_ENV === 'development') {
            return await generator();
        }

        if (fs.existsSync(this.path) && fs.statSync(this.path).mtimeMs >= (new Date() - this.maxAgeMinutes*60*1000)) {
            const content = fs.readFileSync(this.path);
            return this.path.endsWith('.js') ? JSON.parse(content) : content;
        }

        const result = await generator();

        fs.writeFileSync(this.path, this.path.endsWith('.js') ? JSON.stringify(result) : result);

        return result;
    }

    async invalidate() {
        fs.unlinkSync(this.path);
    }
}

export const caches = {
    admins: new CacheObject('main', 'admins.js', 10),
    adminsFooter: new CacheObject('main', 'footer.js', 10),
    blog: new CacheObject('main', 'blog.js', Infinity),
    nouns: new CacheObject('main', 'nouns.js', 10),
    terms: new CacheObject('main', 'terms.js', 10),
    inclusive: new CacheObject('main', 'inclusive.js', 10),
}
