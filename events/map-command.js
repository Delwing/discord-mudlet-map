const { Message, Client, MessageAttachment } = require("discord.js");
const MapResolver = require("../maps/map-resolver");
const { Renderer } = require("mudlet-map-renderer");
const sharp = require("sharp");

const scale = 40;
let settings = { scale: scale };

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (config) => {
  Object.keys(config).map(async (key) => {
    MapResolver.prepareMap(key, config[key].provider)
      .then((reader) => {
        config[key].reader = reader;
        console.log(`${key} map ready!`);
      })
      .catch((err) => console.log(err));
  });

  return async (message) => {
    Object.keys(config).forEach((key) => {
      let element = config[key];
      let roomId = element.locationExtractor(message.content);
      if (roomId) {
        let reader = element.reader;
        if (!reader) {
            message.channel.send(`${key} - map not ready`);  
        }
        let area = reader.getAreaByRoomId(roomId);
        if (!area) {
          message.channel.send(`${key} - no location ID`);
          return;
        }
        async function render() {
          let renderer = new Renderer(null, reader, area, reader.getColors(), settings);
          renderer.renderPosition(roomId);
          sharp(Buffer.from(renderer.exportSvg(roomId, 10)))
            .png()
            .toBuffer()
            .then((buffer) => {
              message.channel.send(`${key} - ${area.areaName}`, new MessageAttachment(buffer, `${key} - ${roomId}.png`));
            })
            .catch(function (err) {
              console.log(err);
            });
        }
        render();
      }
    });
  };
};
