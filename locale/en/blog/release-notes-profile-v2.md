# Release Notes: Public API profiles v2

<small>2022-09-24 | [@andrea](/@andrea)</small>

I gotta admit, I didn't plan the public API too well 😅
I just never expected this website, let alone the API interface, to get so popular.
So it's just a bunch of unversioned internal endpoints.
You can _technically_ use all of them, but only for a few read-only endpoints
I'm taking care of keeping backwards compatibility – they're listed on the [Public API](/api) page.

Now comes the time when a new version is actually needed for one of them.
We're planning to start adding a couple new features to cards/profiles –
but the current profile schema is far from extensible.
Before we can start with any of the upcoming changes,
we need to fix the schema.

Originally, we had three “opinion” options: “Yes!” (`1`), “Meh” (`0`) and “Nope” (`-1`).
While it made sense for that set to be represented by sortable integers, it doesn't anymore:
we've added “Jokingly” and “Only, if we're close”, and they don't easily fit on a scale.
In `v2` opinions will be represented by human-readable strings: `'yes'`, `'meh'`, `'nope'`, `'jokingly'` and `'close'`.
This also opens up the system to custom opinions.

Fields `names`, `pronouns`, `customFlags` and `words` won't contain dictionaries (`value => opinion`) anymore,
but instead an extendable list of objects (`{value, opinion, ...}`):

```js
const namesV1 = {
    Zuzu: 1,
    '[deadname]': -1,
};

const namesV2 = [
    { value: 'Zuzu', opinion: 'yes' },
    { value: '[deadname]', opinion: 'nope' },
];
```

```js
const pronounsV1 = {
    they: 1,
    'she&they': 0,
};

const pronounsV2 = [
    { value: 'they', opinion: 'yes' },
    { value: 'she&they', opinion: 'meh' },
];
```

```js
const customFlagsV1 = {
    '01GDKQT963CCZVV1H86GTY56RG': 'Rosegender',
};

const customFlagsV2 = [
    { value: '01GDKQT963CCZVV1H86GTY56RG', name: 'Rosegender' },
];
```

```js
const wordsV1 = [
    {sir: -1, madam: -1},
    {partner: 1, boyfriend: -1, girlfriend: -1},
];

const wordsV2 = [
    { header: 'honorifics', values: [
        {value: 'sir', opinion: 'nope'},
        {value: 'madam', opinion: 'nope'},
    ] },
    { header: 'relationship descriptions', values: [
        {value: 'partner', opinion: 'yes'},
        {value: 'boyfriend', opinion: 'nope'},
        {value: 'girlfriend', opinion: 'nope'},
    ] },
];
```

Profiles will be stored in the database using v2 schema, but all requests to `GET /api/profile/get/{username}`
will keep returning profiles in the v1 schema, downgrading it on the fly.

To use the new features that v2 schema will allow, use `GET /api/profile/get/{username}?version=2` instead.
