# Link Name From URL

This is a plugin for [Obsidian](https://obsidian.md) to help generate Markdown links from raw URLs. This plugin does it by taking the part of the URL and transforming it a little bit.

This plugin was created as an alternative to the [obsidian-auto-link-title plugin](https://github.com/zolrath/obsidian-auto-link-title). The main differnce is that **this plugin doesn't fetch a page** and tries to get the name from the URL. The result heavily depends on the site you trying to use it with. For example, this plugin is useless with **youtube** because their URLs do not contain a name. But it works great with the **curseforge**, for example. Their URLs contain name and **auto-link-title** is actually gets a lot more unwanted information than this plugin.

## How to use

- Install the plugin
- Select URL and run `get-link-name-from-url` command

Or you can enable `Auto convert` setting in the plugin settings. It will automatically convert URLs you paste.

## Manually installing the plugin

- Download latest release from the **Releases** tab
- Copy over `main.js`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/link-name-from-url/`.
