import fs from 'fs';

export default async (dir, filename, maxAgeMinutes, generator) => {
    const cacheDir = `${__dirname}/../cache/${dir}`
    fs.mkdirSync(cacheDir, { recursive: true });
    const cacheFilename = `${cacheDir}/${filename}`;

    if (fs.existsSync(cacheFilename) && fs.statSync(cacheFilename).mtimeMs >= (new Date() - maxAgeMinutes*60*1000)) {
        const content = fs.readFileSync(cacheFilename);
        return filename.endsWith('.js') ? JSON.parse(content) : content;
    }

    const result = await generator();

    fs.writeFileSync(cacheFilename, filename.endsWith('.js') ? JSON.stringify(result) : result);

    return result;
}
