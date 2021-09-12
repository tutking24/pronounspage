export default async function parseMarkdown(markdown) {
    try {
        const content = '<div>' +
            markdown
                .replace(/<table>/g, '<div class="table-responsive"><table class="table table-striped small">')
                .replace(/<\/table>/g, '</table></div>')
                .replace(/<a href="http/g, '<a target="_blank" rel="noopener" href="http')
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
