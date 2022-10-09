import { Router } from 'express';
import {handleErrorAsync} from "../../src/helpers";
import buildLocaleList from "../../src/buildLocaleList";
import fs from 'fs';

const router = Router();

router.get('/versions', handleErrorAsync(async (req, res) => {
    return res.json(buildLocaleList(global.config.locale));
}));

router.get('/locales', handleErrorAsync(async (req, res) => {
    return res.json(buildLocaleList(global.config.locale));
}));

router.get('/version', handleErrorAsync(async (req, res) => {
    const versionFile = __dirname + '/../../cache/version';
    return res.json(fs.existsSync(versionFile) ? fs.readFileSync(versionFile).toString('utf-8') : null);
}));

export default router;
