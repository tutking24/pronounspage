import { Router } from 'express';
import {handleErrorAsync} from "../../src/helpers";
import { createEvents } from 'ics';
import { calendar } from '../../src/calendar/calendar';
import {loadSuml} from "../loader";
import { clearLinkedText } from '../../src/helpers';
// TODO caching? // import { caches } from "../../src/cache";

const translations = loadSuml('translations');

const renderEvents = (yearEvents, res) => {
    const events = [];
    let i = 1;
    for (let year in yearEvents) {
        if (!yearEvents.hasOwnProperty(year)) { continue; }
        for (let event of yearEvents[year]) {
            if (!event) { continue; }
            const ics = event.toIcs(year, translations, clearLinkedText, i);
            if (ics !== null) {
                events.push(ics);
            }
        }
        i++;
    }

    if (events.length === 0) {
        return res.status(404).json({error: 'Not found'});
    }

    createEvents(
        events,
        (error, value) => {
            if (error) {
                console.error(error);
                return res.status(500).json({error: 'Unexpected server error'});
            }

            res.header('Content-type', 'text/calendar');
            res.send(value);
        }
    );
}

const router = Router();

const routeBase = `/queer-calendar-${global.config.locale}`;

router.get(routeBase + '.ics', handleErrorAsync(async (req, res) => {
    let events = {};
    for (let year of calendar.getAllYears()) {
        events[year.year] = year.events;
    }

    renderEvents(events, res);
}));

router.get(routeBase + '-:year-:uuid.ics', handleErrorAsync(async (req, res) => {
    const year = calendar.getYear(req.params.year);
    if (!year) {
        return res.status(404).json({error: 'Not found'});
    }

    renderEvents({[year.year]: [year.eventsByUuid[req.params.uuid]]}, res)
}));

router.get(routeBase + '-:year.ics', handleErrorAsync(async (req, res) => {
    const year = calendar.getYear(req.params.year);
    if (!year) {
        return res.status(404).json({error: 'Not found'});
    }

    renderEvents({[year.year]: year.events}, res)
}));

export default router;
