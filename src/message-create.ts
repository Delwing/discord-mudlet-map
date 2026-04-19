import type { Message } from "discord.js";
import { PngBytesExporter } from "mudlet-map-renderer";
import type { MapConfig, MessageCreator, Room } from "./types.js";

const defaultMessageCreator: MessageCreator = (key, area) =>
  `${key} - ${area.areaName}`;

export default function mapCommand(config: MapConfig) {
  return async (message: Message) => {
    const channel = message.channel;
    if (!("send" in channel)) return;

    for (const key of Object.keys(config)) {
      const element = config[key];
      element.renderArea = element.renderArea ?? false;
      const reader = element.reader;
      if (!reader) continue;

      const extracted = element.locationExtractor(message.content, reader);
      if (!extracted) continue;

      const textOnly = !element.provider && !element.mapRenderer;

      if (!element.mapRenderer && !textOnly) {
        await channel.send(`${key} - map not ready`);
        continue;
      }

      const roomId = Number(extracted);
      let room: Room;
      let area;
      try {
        room = reader.getRoom(roomId);
        area = reader.getArea(room.area);
      } catch {
        await channel.send(`${key} - no location ID`);
        continue;
      }
      if (!room || !area) {
        await channel.send(`${key} - no location ID`);
        continue;
      }

      const areaInfo = {
        areaName: area.getAreaName(),
        areaId: area.getAreaId(),
      };
      const content = (element.messageCreator ?? defaultMessageCreator)(
        key,
        areaInfo,
        room,
      );

      if (textOnly) {
        try {
          await channel.send({ content });
        } catch (err) {
          console.log(err);
        }
        continue;
      }

      try {
        const renderer = element.mapRenderer!;
        renderer.drawArea(room.area, room.z);
        const bytes = renderer.export(
          new PngBytesExporter({
            width: 1200,
            height: 1200,
            roomId: element.renderArea ? undefined : roomId,
            padding: element.renderArea ? 3 : 10,
            overlays: { position: { roomId } },
          }),
        );
        if (!bytes) {
          console.log(`${key} - PNG export returned empty buffer`);
          continue;
        }
        await channel.send({
          content,
          files: [
            {
              attachment: Buffer.from(bytes),
              name: `${key} - ${roomId}.png`,
            },
          ],
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
}
