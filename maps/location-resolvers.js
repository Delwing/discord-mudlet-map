let plainRegexp = (regexp, searchFunction) => (message, reader) => {
    if (!searchFunction) {
        searchFunction = (arg) => arg[1]
    }
    let matches = message.match(regexp)
    if (matches) {
        return searchFunction(matches, reader);
    } else {
        return false;
    }
};

module.exports = {
    plainRegexp: plainRegexp,
};