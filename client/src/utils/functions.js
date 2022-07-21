// Accepts API Data with _ID  and send back a JSON with ID
export const refactorID = (data) => {
    JSON.parse(JSON.stringify(data).split('"_id":').join('"id":'));
}

export const contentSlicer = (content) => {
    return content.length > 200
        ? content.slice(0, 196) + "..."
        : content
}

export const slugGenerator = (title) => {
    var slug = title;
    if (title.length > 15) {
        slug = title.substring(0, 14)
    }
    return slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '_')
        .replace(/^-+|-+$/g, '');
}

export const usernameGenerator = () => {
    return (Math.random() + 1).toString(36).substring(2);
}