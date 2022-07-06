import { App, MarkdownView, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface PluginSettings {
	autoConvert: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
	autoConvert: true
}

export default class LinkNameFromUrlPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: 'get-link-name-from-url',
			name: 'Get link name from URL',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						new SampleModal(this.app).open();
					}

					return true;
				}
			}
		});

		this.addSettingTab(new SettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		if (this.settings.autoConvert) {
			this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
				console.log('click', evt);
			});
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
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
