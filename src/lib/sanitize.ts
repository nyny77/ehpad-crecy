import sanitizeHtml from "sanitize-html";

export const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'span', 'u', 's', 'sub', 'sup']),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['style', 'class', 'className'],
        'a': ['href', 'target', 'rel', 'title'],
        'img': ['src', 'alt', 'width', 'height']
    }
};

export function sanitizeContent(html: string): string {
    if (!html) return "";
    return sanitizeHtml(html, sanitizeOptions);
}
