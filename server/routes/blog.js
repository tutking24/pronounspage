import { Router } from 'express';
import {handleErrorAsync, shuffle} from "../../src/helpers";
import fs from 'fs';
import { caches } from "../../src/cache";

const router = Router();

router.get('/blog', handleErrorAsync(async (req, res) => {
    return res.json(await caches.blog.fetch(async () => {
        const dir = __dirname + '/../../data/blog';
        const posts = [];
        fs.readdirSync(dir).forEach(file => {
            if (!file.endsWith('.md')) {
                return;
            }

            const slug = file.substring(0, file.length - 3);
            const content = fs.readFileSync(dir + '/' + file)
                .toString('utf-8')
                .split('\n')
                .filter(l => !!l);

            let title = '', date = '', authorsRaw = '', authors = [], hero = null;

            try {
                title = content[0].match(/^# (.*)$/)[1];
            } catch {
                return;
            }

            try {
                [, date, authorsRaw] = content[1].match(/^<small>(\d\d\d\d-\d\d-\d\d) \| ([^|]*).*<\/small>$/);
                authors = authorsRaw.split(',').map(a => {
                    a = a.trim();
                    let m = a.match(/^\[([^\]]+)]/);
                    if (m) { return m[1]; }
                    return a;
                });
            } catch {
                return;
            }

            try {
                const classHeroImages = content.map(x => x.match(/<img src="([^"]+)" class="hero/)).filter(x => !!x);
                if (classHeroImages.length) {
                    hero = classHeroImages[0][1];
                    throw 'continue';
                }

                const images = content.map(x => x.match(/^!\[[^\]]*]\(([^)]+)\)$/)).filter(x => !!x);
                if (images.length) {
                    hero = images[0][1];
                }
            } catch {
            }

            posts.push({slug, title, date, authors, hero});
        });

        return posts.sort((a, b) => {
            if (a.date < b.date) { return 1; }
            if (a.date > b.date) { return -1; }
            return 0;
        });
    }));
}));

export default router;
