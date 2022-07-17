import { Router } from 'express';
import {handleErrorAsync} from "../../src/helpers";
import buildLocaleList from "../../src/buildLocaleList";

const router = Router();

router.get('/versions', handleErrorAsync(async (req, res) => {
    return res.json(buildLocaleList(global.config.locale));
}));

router.get('/locales', handleErrorAsync(async (req, res) => {
    return res.json(buildLocaleList(global.config.locale));
}));

export default router;
