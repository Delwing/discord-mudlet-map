export function plainRegexp(regexp, searchFunction) {
    const fn = searchFunction ?? ((arg) => arg[1]);
    return (message, reader) => {
        const matches = message.match(regexp);
        if (matches)
            return fn(matches, reader);
        return false;
    };
}
//# sourceMappingURL=location-resolvers.js.map