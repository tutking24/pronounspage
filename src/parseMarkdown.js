export default async function parseMarkdown(markdown) {
    try {
        const content = '<div>' +
            markdown
                .replace(/<table>/g, '<div class="table-responsive"><table class="table table-striped small">')
                .replace(/<\/table>/g, '</table></div>')
                .replace(/{favicon=(.+?)}/g, '<img src="https://$1" alt="Favicon" style="width: 1em; height: 1em;"/>')
                .replace(/<a href="http/g, '<a target="_blank" rel="noopener" href="http')
                .replace(/<p>{details=(.+?)}<\/p>(.+?)<p>{\/details}<\/p>/gms, '<details class="border mb-3"><summary class="bg-light p-3">$1</summary><div class="border-top p-3 bg-white">$2</div></details>')
            + '</div>'
        ;
        const titleMatch = content.match('<h1[^>]*>([^<]+)</h1>');
        const title = titleMatch ? titleMatch[1] : null;
        const imgMatch = content.match('<img src="([^"]+)"[^>]*>');
        const img = imgMatch ? imgMatch[1] : null;

        return {
            content,
            title,
            img,
        }
    } catch {
        return {
            content: null,
        };
    }
}
