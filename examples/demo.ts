import "konva/canvas-backend";

import fs from "fs";
import path from "path";
import {
  MapRenderer,
  PngBytesExporter,
  createSettings,
} from "mudlet-map-renderer";

import * as LocationResolvers from "../src/location-resolvers.js";
import * as MapProviders from "../src/map-providers.js";
import { prepareMap } from "../src/prepare-map.js";
import type { MapConfigEntry } from "../src/types.js";

const KEY = "Arkadia";
const SAMPLE_MESSAGE = process.argv[2] ?? "!lok 1";

const config: MapConfigEntry = {
  locationExtractor: LocationResolvers.plainRegexp("(?:!lok|/prowadz) (\\d+)"),
  provider: MapProviders.retryingDownloader(
    "https://raw.githubusercontent.com/Delwing/arkadia-mapa/master/map_master3.dat",
    { retries: 5, delay: 10000 },
  ),
  messageCreator: (key, area, room) =>
    `${key} - ${area.areaName} - https://delwing.github.io/arkadia-mapa/?loc=${room.id}`,
};

async function main() {
  console.log(`Preparing ${KEY} map...`);
  const reader = await prepareMap(KEY, config.provider);
  console.log(`${KEY} map ready.`);

  const extracted = config.locationExtractor(SAMPLE_MESSAGE, reader);
  if (!extracted) {
    throw new Error(`No location matched in message: "${SAMPLE_MESSAGE}"`);
  }
  const roomId = Number(extracted);

  let room;
  let area;
  try {
    room = reader.getRoom(roomId);
    area = reader.getArea(room.area);
  } catch (err) {
    const sample = reader
      .getRooms()
      .slice(0, 10)
      .map((r) => r.id)
      .join(", ");
    throw new Error(
      `Room ${roomId} not found. Try one of: ${sample}... (${reader.getRooms().length} rooms total)`,
    );
  }

  const settings = createSettings();
  if (!config.renderArea && settings.areaName === undefined) {
    settings.areaName = false;
  }
  const renderer = new MapRenderer(reader, settings);
  renderer.drawArea(room.area, room.z);

  const bytes = renderer.export(
    new PngBytesExporter({
      width: 1200,
      height: 1200,
      roomId: config.renderArea ? undefined : roomId,
      padding: config.renderArea ? 3 : 10,
      overlays: { position: { roomId } },
    }),
  );
  if (!bytes) throw new Error("PNG export returned empty buffer");

  const content = config.messageCreator!(
    KEY,
    { areaName: area.getAreaName(), areaId: area.getAreaId() },
    room,
  );

  const outPath = path.resolve(`demo-${KEY}-${roomId}.png`);
  fs.writeFileSync(outPath, Buffer.from(bytes));
  console.log(`Message: ${content}`);
  console.log(`Image:   ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
