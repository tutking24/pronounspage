import {DateTime} from "luxon";

export const max = DateTime.now();
export const min = DateTime.local(2020, 1, 1);
export const closed = DateTime.local(2020, 1, 1); // TODO DateTime.local(2023, 1, 1);

export const AREAS = [
    'translation',
    'moderation',
    'content creation',
    'coding',
    'devops',
    'user support',
    'social media',
    'media interviews',
    'design',
    'sensitivity reviews',
    'administration',
    'blog',
    'census',
    'other',
];

export const MONTHS = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
};

export const TRANSFER_METHODS = {
    'bank': 'Bank transfer',
    'paypal': 'PayPal',
    'charity': 'Charity',
    'skip': 'Skip allowance',
};

export const PERIODS = {
    '2020-2022': [2020, 1, 2022, 12],
    '2023': [2023, 1, 2023, 12],
}
