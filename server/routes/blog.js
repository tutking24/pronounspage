import { Router } from 'express';
import {handleErrorAsync, shuffle} from "../../src/helpers";
import fs from 'fs';
import cache from "../../src/cache";

const router = Router();

router.get('/blog', handleErrorAsync(async (req, res) => {
    return res.json(await cache('main', 'blog.js', Infinity, async () => {
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
                authors = authorsRaw.split(',').map(a => a.trim().match(/^\[@([^\]]+)]/)[1])
            } catch {
                return;
            }

            try {
                hero = content[2].match(/^!\[[^\]]*]\(([^)]+)\)$/)[1];
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
