/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MetadataHider
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  enableSnippet: true,
  propertiesVisible: "",
  propertiesInvisible: ""
};
var MetadataHider = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new MetadataHiderSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
function genCSS(properties, cssPrefix, cssSuffix) {
  let body = [];
  for (let property of properties.split(",")) {
    body.push(`.metadata-property[data-property-key="${property.trim()}"]`);
  }
  return cssPrefix + "\n" + body.join(", \n") + "\n" + cssSuffix + "\n\n";
}
async function genSnippetCSS(plugin) {
  var _a;
  const content = [
    "/* * WARNING: This file will be overwritten by plugin `Metadata Hider`.",
    "   * DO NOT EDIT THIS FILE DIRECTLY!!!",
    "   * Do not edit this file directly!!!",
    "* /",
    ""
  ];
  content.push(genCSS(plugin.settings.propertiesInvisible, "/* * Custom: Force invisible */", " { display: none !important; }"));
  content.push(genCSS(plugin.settings.propertiesVisible, "/* * Custom: Force visible */", " { display: flex !important; }"));
  const vault = plugin.app.vault;
  const ob_config_path = (_a = vault.configDir) != null ? _a : ".obsidian";
  const snippets_path = ob_config_path + "/snippets";
  await vault.adapter.mkdir(snippets_path);
  const css_filename = "metadata-hider-auto-gen";
  const path = `${snippets_path}/${css_filename}.css`;
  if (await vault.adapter.exists(path)) {
    await vault.adapter.remove(path);
  }
  await plugin.app.vault.create(path, content.join("\n"));
  if (plugin.settings.enableSnippet) {
    const customCss = plugin.app.customCss;
    customCss.enabledSnippets.add(css_filename);
    customCss.requestLoadSnippets();
  }
  plugin.app.workspace.trigger("parse-style-settings");
}
var MetadataHiderSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.debouncedGenerate = (0, import_obsidian.debounce)(this.generateSnippet, 1e3, true);
    this.generateSnippet();
  }
  async generateSnippet() {
    await genSnippetCSS(this.plugin);
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Enable Snippet").setDesc("").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.enableSnippet).onChange(async (value) => {
        this.plugin.settings.enableSnippet = value;
        await this.plugin.saveSettings();
        await genSnippetCSS(this.plugin);
      });
    });
    new import_obsidian.Setting(containerEl).setName("Always display metadata properties").setDesc("seperated by comma (`,`)").addTextArea(
      (text) => text.setValue(this.plugin.settings.propertiesVisible).onChange(async (value) => {
        this.plugin.settings.propertiesVisible = value;
        await this.plugin.saveSettings();
        await genSnippetCSS(this.plugin);
      })
    );
    new import_obsidian.Setting(containerEl).setName("Always hide metadata properties").setDesc("seperated by comma (`,`)").addTextArea(
      (text) => text.setValue(this.plugin.settings.propertiesInvisible).onChange(async (value) => {
        this.plugin.settings.propertiesInvisible = value;
        await this.plugin.saveSettings();
        await genSnippetCSS(this.plugin);
      })
    );
  }
};
