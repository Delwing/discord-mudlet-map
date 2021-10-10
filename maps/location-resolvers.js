let plainRegexp = (regexp) => (message) => {
    let matches = message.match(regexp)
    if (matches) {
        return matches[1];
    } else {
        return false;
    }
};

module.exports = {
    plainRegexp: plainRegexp,
};
