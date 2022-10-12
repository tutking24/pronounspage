import iconsMetadata from '@fortawesome/fontawesome-pro/metadata/icons.yml';

const icons = [];
for (let [iconName, iconMetadata] of Object.entries(iconsMetadata)) {
    icons.push({
        name: iconName,
        styles: iconMetadata.styles,
        searchTerms: [
            ...iconMetadata.search.terms.map(t => (t + '').toLowerCase()),
            iconName.toLowerCase(),
            iconMetadata.label.toLowerCase(),
        ],
    });
}
export default icons;
