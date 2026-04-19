import "konva/canvas-backend";
import { Events } from "discord.js";
import { MapRenderer, createSettings, } from "mudlet-map-renderer";
import mapCommand from "./message-create.js";
import { prepareMap } from "./prepare-map.js";
function buildRenderer(entry, reader) {
    const options = entry.renderer ?? {};
    if (entry.settings && !options.settings) {
        console.warn("config.settings is deprecated, use config.renderer.settings instead");
    }
    const settings = options.settings ?? entry.settings ?? createSettings();
    if (!entry.renderArea && settings.areaName === undefined) {
        settings.areaName = false;
    }
    const renderer = new MapRenderer(reader, settings);
    if (options.style) {
        renderer.setStyle(options.style);
    }
    return renderer;
}
export function configure(client, config) {
    const configurator = () => {
        for (const key of Object.keys(config)) {
            const entry = config[key];
            if (!entry.provider) {
                if (!entry.reader) {
                    console.warn(`${key}: no provider and no reader — entry will be skipped by the message handler.`);
                }
                continue;
            }
            prepareMap(key, entry.provider)
                .then((reader) => {
                entry.reader = reader;
                entry.mapRenderer = buildRenderer(entry, reader);
                console.log(`${key} map ready!`);
            })
                .catch((err) => console.log(err));
        }
    };
    configurator();
    client.on(Events.MessageCreate, mapCommand(config));
    client.on(Events.ClientReady, () => {
        console.log("Bot enhanced with Mudlet maps ready.");
    });
    return configurator;
}
//# sourceMappingURL=bot-configurator.js.map