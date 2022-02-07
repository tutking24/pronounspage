import { Router } from 'express';
import {handleErrorAsync, clearLinkedText} from '../../src/helpers';
import { createEvents } from 'ics';
import { calendar } from '../../src/calendar/calendar';
import {loadSuml} from "../loader";
import { Day } from '../../src/calendar/helpers';

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

const getEventName = (name) => {
    name = translations.calendar.events[name] || name;
    name = name.replace(/{.*?=(.*?)}/g, '$1')
    return name;
}

const buildMessage = (events, locale, day, link) => {
    if (events.length === 0) {
        return null;
    }

    let message = `[${locale.name}] ${day.toString()}\n\n${translations.calendar.banner}:\n`;
    for (let event of events) {
        message += ` - ${event}\n`;
    }
    message += `\n${link}`;

    return message;
}

const eventsSummary = (day, locale) => {
    const eventsRaw = calendar.getCurrentYear().eventsByDate[day.toString()];

    const link = `${locale.url}/${encodeURIComponent(config.calendar.route)}/${day}`;
    const image = `${locale.url}/calendar/${day}.png`;

    let message = null;
    let events = [];
    if (eventsRaw !== undefined && eventsRaw.length > 0) {
        for (let event of eventsRaw) {
            events.push(getEventName(event.name));
            delete event.daysMemoise;
        }
    }
    let eventsForMessage = [...events];
    while (true) {
        message = buildMessage(eventsForMessage, locale, day, link);

        if (message === null || message.length <= 280) {
            break;
        } else {
            eventsForMessage = eventsForMessage.slice(0, eventsForMessage.length - 1);
        }
    }

    return {
        day: day.toString(),
        link,
        image,
        message,
        events,
        eventsRaw: (eventsRaw || []),
    }
}

const router = Router();

router.get('/calendar/today', handleErrorAsync(async (req, res) => {
    return res.json(eventsSummary(
        Day.today(),
        req.locales[global.config.locale],
    ));
}));

router.get('/calendar/:year-:month-:day', handleErrorAsync(async (req, res) => {
    return res.json(eventsSummary(
        new Day(parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day)),
        req.locales[global.config.locale],
    ));
}));

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
