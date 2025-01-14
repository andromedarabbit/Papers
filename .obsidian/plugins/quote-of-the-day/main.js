var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => QuoteOfTheDay
});
var import_obsidian2 = __toModule(require("obsidian"));

// src/settingsTab.ts
var import_obsidian = __toModule(require("obsidian"));
var QotDSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Quote of the Day Settings" });
    new import_obsidian.Setting(containerEl).setName("Quote Format").setDesc("Format the way the quote is displayed").addTextArea((text) => {
      text.setPlaceholder("Quote format").setValue(this.plugin.settings.quoteFormat).onChange((value) => __async(this, null, function* () {
        console.log("New Quote format: " + value);
        let valid = value.contains("{author}") && value.contains("{content}");
        if (!valid) {
          new import_obsidian.Notice("Invalid format! Missing {author} or {content} field");
          return;
        }
        this.plugin.settings.quoteFormat = value;
        yield this.plugin.saveSettings();
      }));
      text.inputEl.setAttr("rows", 4);
      text.inputEl.addClass("settings_area");
    });
    new import_obsidian.Setting(containerEl).setName("Quote Tag Format").setDesc("Format the way the quote tags are displayed").addTextArea((text) => {
      text.setPlaceholder("Quote tag format").setValue(this.plugin.settings.quoteTagFormat).onChange((value) => __async(this, null, function* () {
        console.log("New Quote tag format: " + value);
        let valid = value.contains("{tags}");
        if (!valid) {
          new import_obsidian.Notice("Invalid format! Missing {tags} field");
          return;
        }
        this.plugin.settings.quoteTagFormat = value;
        yield this.plugin.saveSettings();
      }));
      text.inputEl.setAttr("rows", 4);
      text.inputEl.addClass("settings_area");
    });
    new import_obsidian.Setting(containerEl).setName("Quote Template Placeholder").setDesc("Format the way the quote placeholder is used when creating a note from template").addText((text) => {
      text.setPlaceholder("Quote Template Placeholder").setValue(this.plugin.settings.quoteTemplatePlaceholder).onChange((value) => __async(this, null, function* () {
        console.log("New Quote template placeholder: " + value);
        this.plugin.settings.quoteTemplatePlaceholder = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian.Setting(containerEl).setName("Filtered Quote Template Placeholder").setDesc("Format the way the filtered quote placeholder is used when creating a note from template").addText((text) => {
      text.setPlaceholder("Filtered Quote Template Placeholder").setValue(this.plugin.settings.filteredQuoteTemplatePlaceholder).onChange((value) => __async(this, null, function* () {
        console.log("New Filtered Quote template placeholder: " + value);
        this.plugin.settings.filteredQuoteTemplatePlaceholder = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian.Setting(containerEl).setName("Show Quote Tags").setDesc("Display the quote tags").addToggle((toggle) => toggle.setValue(this.plugin.settings.showTags).onChange((value) => __async(this, null, function* () {
      console.log("New Show tags: " + value);
      this.plugin.settings.showTags = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Show Quote Tags Hashtag").setDesc("Display the quote tags with # symbol").addToggle((toggle) => toggle.setValue(this.plugin.settings.showTagHash).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.showTagHash = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Quote Placeholder Interval").setDesc("Interval to check for quote placeholder presence and quote generation").addSlider((toggle) => toggle.setLimits(5, 60, 1).setValue(this.plugin.settings.placeholderInterval).onChange((value) => __async(this, null, function* () {
      console.log("New placeholderInterval: " + value);
      this.plugin.settings.placeholderInterval = value;
      yield this.plugin.saveSettings();
    })).setDynamicTooltip());
    const { moment } = window;
    const filters = filtersList;
    let dd = new import_obsidian.Setting(this.containerEl).setName("Quote of the Day Filters").setDesc("Current filter: " + this.plugin.getFilters(" , ")).addDropdown((dropdown) => {
      dropdown.addOption("None", "None");
      filters.forEach((filter, i) => {
        dropdown.addOption(filters[i], filter);
      });
      dropdown.onChange((val) => {
        if (val == "None") {
          this.plugin.settings.filter = ["None"];
        } else {
          if (this.plugin.settings.filter.includes(val)) {
            this.plugin.settings.filter = this.plugin.settings.filter.filter((i) => i !== val);
          } else {
            this.plugin.settings.filter.push(val);
          }
        }
        console.log(this.plugin.settings.filter);
        dd.setDesc("Current filter: " + this.plugin.getFilters(" , "));
        this.plugin.saveSettings();
      });
      dropdown.selectEl.setAttr("multiple", null);
    });
  }
};
var filtersList = [
  "Age",
  "Athletics",
  "Business",
  "Change",
  "Character",
  "Competition",
  "Conservative",
  "Courage",
  "Creativity",
  "Education",
  "Ethics",
  "Failure",
  "Faith",
  "Family",
  "Famous Quotes",
  "Film",
  "Freedom",
  "Friendship",
  "Future",
  "Generosity",
  "Genius",
  "Gratitude",
  "Happiness",
  "Health",
  "History",
  "Honor",
  "Humor",
  "Humorous",
  "Imagination",
  "Inspirational",
  "Knowledge",
  "Leadership",
  "Life",
  "Literature",
  "Love",
  "Mathematics",
  "Motivational",
  "Nature",
  "Opportunity",
  "Pain",
  "Perseverance",
  "Philosophy",
  "Politics",
  "Power Quotes",
  "Proverb",
  "Religion",
  "Sadness",
  "Science",
  "Self",
  "Self Help",
  "Social Justice",
  "Society",
  "Spirituality",
  "Sports",
  "Stupidity",
  "Success",
  "Technology",
  "Time",
  "Tolerance",
  "Truth",
  "Virtue",
  "War",
  "Weakness",
  "Wellness",
  "Wisdom",
  "Work"
];

// src/main.ts
var QUOTE_API_URL = "https://florinbobis-quotes-net.hf.space/quotes";
var MAX_TAG_CHARS = 25;
var DEFAULT_SETTINGS = {
  quoteFormat: `>[!quote] Quote of the Day
	> {content}
> &mdash; <cite>{author}</cite>\u270D\uFE0F`,
  quoteTagFormat: `> ---
> {tags}
`,
  quoteTemplatePlaceholder: "{{qotd}}",
  filteredQuoteTemplatePlaceholder: "{{fqotd}}",
  showTags: false,
  showTagHash: true,
  placeholderInterval: 5,
  filter: []
};
var QuoteOfTheDay = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.getMarkdownFromQuote = (qod) => {
      let text = this.settings.quoteFormat.replace("{content}", qod.quoteText).replace("{author}", qod.author);
      if (this.settings.showTags) {
        let tagSymb = "";
        if (this.settings.showTagHash) {
          tagSymb = "#";
        }
        let tags = "";
        if (qod.categories) {
          tags = qod.categories.split(",").map((t) => `${tagSymb}${t}`).join(", ");
        }
        let quoteTags = this.settings.quoteTagFormat.replace("{tags}", tags);
        text = text + "\n" + quoteTags;
      }
      return text;
    };
    this.sleep = (delay) => {
      return new Promise((resolve) => setTimeout(resolve, delay));
    };
    this.updateQuotePlaceholder = () => __async(this, null, function* () {
      if (this.started) {
        return;
      }
      this.started = true;
      const file = this.app.workspace.getActiveFile();
      let t = yield this.app.vault.read(file);
      if (t.includes(this.settings.quoteTemplatePlaceholder)) {
        while (t.search(this.settings.quoteTemplatePlaceholder) !== -1) {
          yield this.sleep(500);
          let qod = yield this.getRandomQuote();
          let quote = this.getMarkdownFromQuote(qod);
          t = t.replace(this.settings.quoteTemplatePlaceholder, quote);
        }
        this.app.vault.modify(file, t);
      }
      if (t.includes(this.settings.filteredQuoteTemplatePlaceholder)) {
        while (t.search(this.settings.filteredQuoteTemplatePlaceholder) !== -1) {
          yield this.sleep(500);
          let qod = yield this.getFilteredQuote();
          let quote = this.getMarkdownFromQuote(qod);
          t = t.replace(this.settings.filteredQuoteTemplatePlaceholder, quote);
        }
        this.app.vault.modify(file, t);
      }
      this.started = false;
    });
    this.getRandomQuote = () => __async(this, null, function* () {
      let qod = {
        quoteText: "Oops, I did it again \u{1F64A}",
        author: "Britney Error \u{1F622}",
        categories: "error"
      };
      try {
        let response = yield fetch(`${QUOTE_API_URL}/random?dataset=quotable`);
        let result = yield response.json();
        if (!result.statusCode) {
          qod = result;
        }
      } catch (err) {
        console.log(err);
        new import_obsidian2.Notice(err.message);
      }
      return qod;
    });
    this.getFilteredQuote = () => __async(this, null, function* () {
      let qod = {
        quoteText: "Oops, I did it again \u{1F64A}",
        author: "Britney Error \u{1F622}",
        categories: "error"
      };
      try {
        let filters = this.getFilters("|");
        let response = yield fetch(`${QUOTE_API_URL}/random?dataset=quotable&tags=${filters}`);
        let result = yield response.json();
        if (!result.statusCode) {
          qod = result;
        }
      } catch (err) {
        console.log(err);
        new import_obsidian2.Notice(err.message);
      }
      return qod;
    });
    this.getFilters = (sep) => {
      let f = this.settings.filter.filter((i) => i !== "None");
      return f.join(sep);
    };
  }
  onload() {
    return __async(this, null, function* () {
      console.log("Loading Quote of the Day plugin...");
      yield this.loadSettings();
      this.registerInterval(window.setInterval(() => this.updateQuotePlaceholder(), this.settings.placeholderInterval * 1e3));
      this.addCommand({
        id: "qotd-random",
        name: "Insert Random Quote of the Day",
        editorCallback: (editor, view) => __async(this, null, function* () {
          let qod = yield this.getRandomQuote();
          editor.replaceSelection(this.getMarkdownFromQuote(qod));
        })
      });
      this.addCommand({
        id: "qotd-tag",
        name: "Insert Random Quote of the Day by selected tag",
        checkCallback: (checking) => {
          let markdownView = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
          if (markdownView) {
            if (!checking) {
              const sel = markdownView.editor.getSelection();
              const validSelection = sel && sel.length > 2;
              if (!validSelection) {
                return false;
              }
            }
            return true;
          }
          return true;
        },
        editorCallback: (editor, view) => __async(this, null, function* () {
          let qod = {
            quoteText: "Oops, cannot find that tag \u{1F64A}",
            author: "Tag Error \u{1F622}",
            categories: "error"
          };
          try {
            const sel = editor.getSelection();
            const validSelection = sel && sel.length > 2;
            if (!validSelection) {
              throw new Error("Invalid tag");
            }
            const tag = sel.substr(0, MAX_TAG_CHARS).trim();
            let response = yield fetch(`${QUOTE_API_URL}/random?tags=${tag}`);
            let result = yield response.json();
            if (!result.statusCode) {
              qod = result;
            }
          } catch (err) {
            console.log(err);
            new import_obsidian2.Notice(err.message);
          }
          editor.replaceSelection(this.getMarkdownFromQuote(qod));
        })
      });
      this.addSettingTab(new QotDSettingsTab(this.app, this));
    });
  }
  onunload() {
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};

/* nosourcemap */