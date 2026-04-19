# 0.6.0
- `provider` is now optional — entries without a provider operate in text-only mode (no map download, no rendering)
- text-only entries must supply a `reader` (typically shared from another entry) and a `messageCreator`; the handler replies with the `messageCreator` return value as plain text
- `configure()` now skips `prepareMap` for provider-less entries instead of crashing

# 0.5.0
- rewrite in TypeScript with ESM output
- switch to konva-based mudlet-map-renderer

# 0.3.0
- drop renderFragmentOption
- add renderArea option

# 0.2.0
- add message creator configuration

# 0.1.2
- fix hash search

# 0.1.1
- fix dependency

# 0.1.0
- add location search functions
- fix no room handling

# 0.0.7
- fix map downloader - should prevent attempts to read map before stream finishes writes, thus failing to read map
- move configuration loop into bot-configurator.js 

# 0.0.6
- remove debug messages

# 0.0.5
- Use limitting function for generating area image

# 0.0.4
- Update dependencies

# 0.0.3
- Add way of customizing map rendering settings

# 0.0.2
- Fix README example

# 0.0.1
- Initial release