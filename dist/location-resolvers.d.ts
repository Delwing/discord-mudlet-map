import type { MapReader } from "mudlet-map-renderer";
import type { LocationExtractor } from "./types.js";
export type SearchFunction = (matches: RegExpMatchArray, reader: MapReader) => string | number;
export declare function plainRegexp(regexp: RegExp | string, searchFunction?: SearchFunction): LocationExtractor;
//# sourceMappingURL=location-resolvers.d.ts.map