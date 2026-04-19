import type { MapReader } from "mudlet-map-renderer";
import type { LocationExtractor } from "./types.js";

export type SearchFunction = (
  matches: RegExpMatchArray,
  reader: MapReader,
) => string | number;

export function plainRegexp(
  regexp: RegExp | string,
  searchFunction?: SearchFunction,
): LocationExtractor {
  const fn: SearchFunction = searchFunction ?? ((arg) => arg[1]);
  return (message, reader) => {
    const matches = message.match(regexp);
    if (matches) return fn(matches, reader);
    return false;
  };
}
