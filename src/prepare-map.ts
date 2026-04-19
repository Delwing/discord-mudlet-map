import fs from "fs";
import path from "path";
import { MudletMapReader } from "mudlet-map-binary-reader";
import { MapReader } from "mudlet-map-renderer";
import type { MapProvider } from "./types.js";

const downloadDir = "downloads";

function ensureDirectoryExists(dirPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.access(dirPath, (err) => {
      if (err) {
        fs.mkdir(dirPath, { recursive: true }, (mkErr) => {
          if (mkErr) reject(mkErr);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

export async function prepareMap(
  key: string,
  provider: MapProvider,
): Promise<MapReader> {
  const dir = path.join(downloadDir, key);
  await ensureDirectoryExists(dir);
  await provider(fs.createWriteStream(path.join(dir, "map.dat")));

  const map = MudletMapReader.read(path.join(dir, "map.dat"));
  const { mapData, colors } = MudletMapReader.export(map, `${dir}/`);

  // mudlet-map-binary-reader drops fields the renderer reads (area/x/y/z,
  // doors, weight, stubs). Merge them back from the raw map model.
  for (const area of mapData) {
    const areaId = parseInt(area.areaId, 10);
    for (const room of area.rooms) {
      const source = map.rooms[room.id];
      if (!source) continue;
      const target = room as unknown as Record<string, unknown>;
      target.area = areaId;
      target.x = source.x;
      target.y = source.y;
      target.z = source.z;
      target.doors = source.doors ?? {};
      target.weight = source.weight;
      target.stubs = source.stubs ?? [];
      target.exitWeights = source.exitWeights ?? {};
      target.name = source.name;
      target.userData = source.userData ?? {};
    }
  }

  return new MapReader(
    mapData as unknown as ConstructorParameters<typeof MapReader>[0],
    colors as unknown as ConstructorParameters<typeof MapReader>[1],
  );
}
