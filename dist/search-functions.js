let hashCache;
export function hashOrIdSearch(matches, reader) {
    const raw = matches[1];
    if (!Number.isNaN(parseInt(raw, 10)))
        return raw;
    if (!hashCache) {
        hashCache = {};
        for (const room of reader.getRooms()) {
            if (room.hash)
                hashCache[room.hash] = room.id;
        }
    }
    return hashCache[raw] ?? -1;
}
//# sourceMappingURL=search-functions.js.map