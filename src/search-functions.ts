import type { MapReader } from "mudlet-map-renderer";

let hashCache: Record<string, number> | undefined;

export function hashOrIdSearch(
  matches: RegExpMatchArray,
  reader: MapReader,
): string | number {
  const raw = matches[1];
  if (!Number.isNaN(parseInt(raw, 10))) return raw;

  if (!hashCache) {
    hashCache = {};
    for (const room of reader.getRooms()) {
      if (room.hash) hashCache[room.hash] = room.id;
    }
  }
  return hashCache[raw] ?? -1;
}
