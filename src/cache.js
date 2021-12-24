import fs from 'fs';

export class CacheObject {
    constructor(dir, filename, maxAgeMinutes) {
        const cacheDir = `${__dirname}/../cache/${dir}`
        if (filename.includes('..')) {
            throw 'Insecure';
        }
        fs.mkdirSync(cacheDir + (filename.includes('/') ? '/' + filename.substring(0, filename.lastIndexOf('/')) : ''), { recursive: true });
        this.path = `${cacheDir}/${filename}`;
        this.maxAgeMinutes = maxAgeMinutes;
    }

    async fetch(generator, enabled = true) {
        if (process.env.NODE_ENV === 'development' || !enabled) {
            return await generator();
        }

        if (fs.existsSync(this.path) && fs.statSync(this.path).mtimeMs >= (new Date() - this.maxAgeMinutes*60*1000)) {
            let content = fs.readFileSync(this.path);
            if (this.path.endsWith('.js') || this.path.endsWith('.txt')) {
                content = content.toString('utf-8')
            }
            if (this.path.endsWith('.js')) {
                content = JSON.parse(content);
            }

            return content;
        }

        const result = await generator();

        fs.writeFileSync(this.path, this.path.endsWith('.js') ? JSON.stringify(result) : result);

        return result;
    }

    async invalidate() {
        if (fs.existsSync(this.path)) {
            fs.unlinkSync(this.path);
        }
    }
}

const buildCache = (dir, maxAgeMinutes) => {
    return (filename) => new CacheObject(dir, filename, maxAgeMinutes);
}

export const caches = {
    admins: new CacheObject('main', 'admins.js', 24 * 60),
    adminsFooter: new CacheObject('main', 'footer.js', 24 * 60),
    blog: new CacheObject('main', 'blog.js', Infinity),
    nouns: new CacheObject('main', 'nouns.js', 24 * 60),
    terms: new CacheObject('main', 'terms.js', 24 * 60),
    inclusive: new CacheObject('main', 'inclusive.js', 24 * 60),
    names: new CacheObject('main', 'names.js', 24 * 60),
    pronounNames: buildCache('pronounNames', 24 * 60),
}
