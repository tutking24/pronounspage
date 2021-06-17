import fs from 'fs';

export default async (dir, filename, maxAgeMinutes, generator) => {
    const cacheDir = `${__dirname}/../cache/${dir}`
    fs.mkdirSync(cacheDir, { recursive: true });
    const cacheFilename = `${cacheDir}/${filename}`;

    if (fs.existsSync(cacheFilename) && fs.statSync(cacheFilename).mtimeMs >= (new Date() - maxAgeMinutes*60*1000)) {
        return fs.readFileSync(cacheFilename);
    }

    const result = await generator();

    fs.writeFileSync(cacheFilename, result);

    return result;
}
