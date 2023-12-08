const { Message } = require("discord.js");
const { Renderer } = require("mudlet-map-renderer");
const sharp = require("sharp");

const defaultMessageCreator = function (key, area, room) {
  return `${key} - ${area.areaName}`;
};

module.exports = (config) => {
  /**
   *
   * @param {Message} message
   */
  return async (message) => {
    Object.keys(config).forEach((key) => {
      let element = config[key];
      element.renderArea = element.renderArea ?? false;
      let reader = element.reader;
      let roomId = element.locationExtractor(message.content, reader);
      if (roomId) {
        if (!reader) {
          message.channel.send(`${key} - map not ready`);
          return;
        }
        let area = reader.getAreaByRoomId(roomId);
        let room = reader.getRoomById(roomId);
        if (!area || !room) {
          message.channel.send(`${key} - no location ID`);
          return;
        }
        if (!element.renderArea) {
          area = area.limit(roomId, 15);
          if (element.settings == undefined) {
            element.settings = {};
          }
          if (element.settings.areaName == undefined) {
            element.settings.areaName = false;
          }
        }
        async function render() {
          let renderer = new Renderer(
            null,
            reader,
            area,
            reader.getColors(),
            element.settings
          );
          renderer.renderPosition(roomId);
          sharp(Buffer.from(element.renderArea ? renderer.exportSvg() : renderer.exportSvg(roomId, 10)))
            .png()
            .toBuffer()
            .then((buffer) => {
              message.channel.send({
                content: (element.messageCreator || defaultMessageCreator)(key, area, room),
                files: [{ attachment: buffer, name: `${key} - ${roomId}.png` }],
              });
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
