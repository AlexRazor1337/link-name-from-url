import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface PluginSettings {
    autoConvert: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
    autoConvert: true
}

const isValidURL = (url: string) => {
    if (url.endsWith(')') || url.startsWith('[') || url.includes('](')) return false;

    let urlObj: URL;

    try {
        urlObj = new URL(url);
    } catch (_) {
        return false;
    }

    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
}

const urlToHyperlink = (url: string) => {
    if (!isValidURL(url)) return url;

    const elements = url.split('/')
    let name = elements[elements.length - 1] !== '' ? elements[elements.length - 1] : elements[elements.length - 2];

    name = name.split('.')[0].split('?')[0].replace(/-|_/gm, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    return `[${name}](${url})`;
}

const convertUrlsFromString = (text: string) => {
    text = text.replace(/(https?|ftp):\/\/[^\s/$.?#].[^\s,]*/ig, urlToHyperlink);

    return text;
}

export default class LinkNameFromUrlPlugin extends Plugin {
    settings: PluginSettings;

    async onload() {
        await this.loadSettings();
        this.addCommand({
            id: 'get-link-name-from-url',
            name: 'Get link name from URL',
            checkCallback: (checking: boolean) => {
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) return false;
                const view_mode = view.getMode();
                switch (view_mode) {
                    case 'source':
                        if (!checking) {
                            if ('editor' in view) {
                                const selection = view.editor.getSelection(); // TODO try to get the nearest URL
                                if (!selection.includes('http')) return false;

                                view.editor.replaceSelection(convertUrlsFromString(selection));
                            }
                        }

                        return true;
                    default:
                        return false;
                }
            }
        });

        this.addSettingTab(new SettingTab(this.app, this));

        if (this.settings.autoConvert) {
            this.registerEvent(this.app.workspace.on('editor-paste', (clipboard: ClipboardEvent) => {
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view || !this.settings.autoConvert) return false;

                const clipboardText = clipboard.clipboardData!.getData("text/plain").trim();
                if (clipboardText == null || clipboardText == "") return;
                if (!clipboardText.includes('http')) return;

                clipboard.stopPropagation();
                clipboard.preventDefault();

                view.editor.replaceSelection(convertUrlsFromString(clipboardText));
            }))
        }
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SettingTab extends PluginSettingTab {
    plugin: LinkNameFromUrlPlugin;

    constructor(app: App, plugin: LinkNameFromUrlPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Auto convert')
            .setDesc('Automatically convert links to hyperlinks with name.')
            .addToggle(text => text
                .setValue(this.plugin.settings.autoConvert)
                .onChange(async (value) => {
                    this.plugin.settings.autoConvert = value;
                    await this.plugin.saveSettings();
                }));
    }
}
