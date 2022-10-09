let hashCache;

let hashOrIdSearch = (matches, reader) => {
    if (!isNaN(parseInt(matches[1]))) {
        return matches[1];
    } else {
        if (!hashCache) {
            hashCache = {};
            Object.entries(reader.roomIndex).forEach((room, index) => {
                hashCache[room[1].hash] = room[1].id;
            })
        }
        return hashCache[matches[1]] ?? -1;
    }
};

module.exports = {
    hashOrIdSearch
};