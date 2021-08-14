import { Day, Calendar } from './helpers';
import internationalEvents from '../../locale/_/events';
import localEvents from '../../locale/pl/events';

export const currentYear = new Calendar(
    Day.today().year,
    [...internationalEvents, ...localEvents],
);
