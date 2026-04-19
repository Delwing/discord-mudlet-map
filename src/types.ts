import type { WriteStream } from "fs";
import type { MapReader, MapRenderer, Settings, Style } from "mudlet-map-renderer";

export type MapProvider = (writeStream: WriteStream) => Promise<void>;

export type LocationExtractor = (
  message: string,
  reader: MapReader,
) => string | number | false;

export type Room = ReturnType<MapReader["getRoom"]>;

export type MessageCreator = (
  key: string,
  area: { areaName: string; areaId: number },
  room: Room,
) => string;

export interface RendererOptions {
  settings?: Settings;
  style?: Style;
}

export interface MapConfigEntry {
  /**
   * Downloads the map. Required for render mode. Omit together with `renderer`
   * to run in text-only mode — you must then supply `reader` (typically shared
   * from another entry) and `messageCreator` instead.
   */
  provider?: MapProvider;
  locationExtractor: LocationExtractor;
  messageCreator?: MessageCreator;
  renderArea?: boolean;
  renderer?: RendererOptions;
  /** @deprecated Use `renderer.settings` instead. */
  settings?: Settings;
  reader?: MapReader;
  mapRenderer?: MapRenderer;
}

export type MapConfig = Record<string, MapConfigEntry>;
