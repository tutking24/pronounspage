import twemoji from 'twemoji';

const census_groups = {
    'location_poland': 'Osoby mieszkające w Polsce',
    'location_abroad': 'Osoby mieszkające za granicą',
    'agab_f': 'Osoby o płci przypisanej przy urodzeniu żeńskiej',
    'agab_m': 'Osoby o płci przypisanej przy urodzeniu męskiej',
}

const census_comparisons = {
    'by_location': 'Podział ze względu na miejsce zamieszkania',
    'by_agab': 'Podział ze względu na płeć przypisaną przy urodzeniu',
}

let jsons = undefined;

const mainPlusDetails = (dict, wide) => (_, content) => {
    return `
        <div class="${wide ? 'wide-escape' : ''}">
            <p>${content.replace(/%group%/g, 'general').replace(/<iframe class="graph" /g, '<iframe class="graph border" ')}</p>`
            + Object.keys(dict).map(group => `
                <details class="border mb-3">
                    <summary class="bg-light px-2 py-1" onclick="this.parentElement.querySelector('iframe.graph').contentDocument.location.reload()">${dict[group]}</summary>
                    <div class="border-top p-md-3 bg-white">${content.replace(/%group%/g, group)}</div>
                </details>`
            ).join('\n') +
        `</div>`;
}

const fetchJson = (_, filename, key) => {
    if (jsons === undefined) { jsons = JSON.parse(process.env.JSONS); }
    let c = jsons[filename];
    for (let part of key.split('.')) {
        c = c[part];
    }
    return c;
}

const generateToC = (content) => (_) => {
    const tags = [];
    let curentLevel = 2;
    let needsClosing = false;
    for (let [, level, id, title] of content.matchAll(/<h([2-6]) id="([^"]+)">([^<]+)<\/h\1>/g)) {
        level = parseInt(level);
        while (level < curentLevel) { tags.push('</li>'); tags.push('</ul>'); curentLevel--; }
        while (level > curentLevel) { tags.push('<ul>'); curentLevel++; needsClosing = false; }
        if (needsClosing) { tags.push('</li>'); }
        tags.push('<li>');
        tags.push(`<a href="#${id}">`);
        tags.push(title);
        tags.push(`</a>`);
        needsClosing = true;
    }
    while (curentLevel < 2) { tags.push('</li>'); tags.push('</ul>'); curentLevel--; needsClosing = false;}
    if (needsClosing) { tags.push('</li>'); }

    return `
        <div class="alert alert-light border">
            <h2 class="h4"><span class="fal fa-list"></span> Spis treści</h2>
            <ul class="mb-0">${tags.join('')}</ul>
        </div>
    `;
}

export default async function parseMarkdown(markdown) {
    try {
        let content = '<div>' +
            markdown
                .replace(/<table>/g, '<div class="table-responsive"><table class="table table-striped small">')
                .replace(/<\/table>/g, '</table></div>')
                .replace(/<a href="http/g, '<a target="_blank" rel="noopener" href="http')
                .replace(/<p>{details=(.+?)}<\/p>(.+?)<p>{\/details}<\/p>/gms, '<details class="border mb-3"><summary class="bg-light p-3">$1</summary><div class="border-top p-3 bg-white">$2</div></details>')
                .replace(/<img (.*?)>/g, (_, attrs) => {
                    let classNames = 'border';
                    const m = attrs.match(/alt="\{(.*)\}/);
                    if (m) {
                        classNames = m[1];
                        attrs = attrs.replace(/alt="{(.*)}/, 'alt="');
                    }
                    return `<div class="text-center"><img ${attrs} class="${classNames}"></div>`;
                })
                .replace(/{favicon=(.+?)}/g, '<img src="https://$1" alt="Favicon" style="width: 1em; height: 1em;"/>')
                .replace(/{embed=\/\/(.+?)=(.+?)}/g, '<div style="position: relative;height: 0;padding-bottom: 56.25%;"><iframe src="https://$1" title="$2" allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups" style="position: absolute;top: 0; left: 0;width: 100%;height: 100%;border:0;"></iframe></div>')
                .replace(/{graph=([^}]+)}/g, '<iframe class="graph" src="$1.html" loading="lazy"></iframe>')
                .replace(/<p>{census_groups}<\/p>(.+?)<p>{\/census_groups}<\/p>/gms, mainPlusDetails(census_groups, false))
                .replace(/<p>{census_comparisons}<\/p>(.+?)<p>{\/census_comparisons}<\/p>/gms, mainPlusDetails(census_comparisons, true))
                .replace(/{json=([^=}]+)=([^=}]+)}/g, fetchJson)
                .replace(/<p>{twemoji}<\/p>(.+?)<p>{\/twemoji}<\/p>/gms, (_, c) => twemoji.parse(c))
                .replace(/<h1 id="🏳️🌈-/g, '<h1 id="') // license header
            + '</div>'
        ;
        content = content.replace(/{table_of_contents}/g, generateToC(content));

        const disableTwemoji = content.includes('<p>{disable_twemoji}</p>');
        content = content.replace(/<p>{disable_twemoji}<\/p>/g, '');

        const titleMatch = content.match('<h1[^>]*>([^<]+)</h1>');
        const title = titleMatch ? titleMatch[1] : null;
        const imgMatch = content.match('<img src="([^"]+)"[^>]*>');
        const img = imgMatch ? imgMatch[1] : null;
        let intro = [];

        for (let introMatch of content.matchAll(/<p[^>]*>(.+?)<\/p>/gms)) {
            const p = introMatch[1].replace(/(<([^>]+)>)/ig, '').replace(/\s+/g, ' ');
            intro = [...intro, ...p.split(' ')];
        }

        return {
            title,
            img,
            intro: intro.length ? intro.slice(0, 24).join(' ') : null,
            content,
            disableTwemoji,
        }
    } catch {
        return {
            content: null,
        };
    }
}
