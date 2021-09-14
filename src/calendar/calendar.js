import { Day, Calendar } from './helpers';
import internationalEvents from '../../locale/_/events';
import localEvents from '../../data/events';

export const currentYear = new Calendar(
    Day.today().year,
    [...internationalEvents, ...localEvents],
);
