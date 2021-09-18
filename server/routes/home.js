import { Router } from 'express';
import {buildLocaleList, handleErrorAsync} from "../../src/helpers";

const router = Router();

router.get('/versions', handleErrorAsync(async (req, res) => {
    return res.json(buildLocaleList(global.config.locale));
}));

export default router;
