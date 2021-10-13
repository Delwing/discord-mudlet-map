# Discord Mudlet Map

This little library helps with Discord bot configuration to provide small Mudlet map fragment images with given location.

## Example

```js
const BOT_TOKEN = "your_token"

const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS] });

const { configure, MapProviders, LocationResolvers } = require("discord-mudlet-map")

let config = {
  Achaea: { 
    locationExtractor: LocationResolvers.plainRegexp("!achaea (\\d+)"),
    provider: MapProviders.retryingDownloader("https://raw.githubusercontent.com/IRE-Mudlet-Mapping/AchaeaCrowdmap/gh-pages/Map/map", { retries: 5, delay : 10000 }) },
    settings: {
      isRound: true
    } // Reffer to: https://github.com/Delwing/js-mudlet-map-renderer#settings-and-their-default-values
};

configure(client, config);

client.login(BOT_TOKEN);
```
