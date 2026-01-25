//Normalizamos archivos adjuntados adjuntados para poder trabajar con ellos 
export function normalizeFileData(attached) {
    if (!attached) return null;

    // Arrays anidados
    if (Array.isArray(attached)) {
        const flattened = attached.flat(Infinity).filter(item => item && typeof item === 'string');
        return flattened.length > 0 ? flattened : null;
    }

    if (typeof attached === 'string') {
        // Manejamos formato de array de PostgreSQL: {url1,url2}
        if (attached.startsWith('{') && attached.endsWith('}')) {
            return attached.slice(1, -1).split(',').map(url => url.trim()).filter(url => url);
        }
        if (attached.includes(',')) {
            return attached.split(',').map(url => url.trim()).filter(url => url);
        }
        // URL
        return [attached];
    }

    return [attached];
};