import { Router } from 'express';
import {handleErrorAsync} from "../../src/helpers";
import { createEvents } from 'ics';
import { calendar } from '../../src/calendar/calendar';
import {loadSuml} from "../loader";
import { clearLinkedText } from '../../src/helpers';
// TODO caching? // import { caches } from "../../src/cache";

const translations = loadSuml('translations');

const router = Router();

router.get('/calendar/queer-calendar-:year.ics', handleErrorAsync(async (req, res) => {
    const year = calendar.getYear(req.params.year);
    if (!year) {
        return res.status(404).json({error: 'Not found'});
    }
    const events = year.events
        .map(e => e.toIcs(req.params.year, translations, clearLinkedText))
        .filter(e => e !== null);

    createEvents(events, (error, value) => {
        if (error) {
            console.error(error);
            return res.status(500).json({error: 'Unexpected server error'});
        }

        res.header('Content-type', 'text/calendar');
        res.send(value);
    })
}));

export default router;
