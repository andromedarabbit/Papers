'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var DEFAULT_SETTINGS = {
    numberOfFilesToShow: 10,
    changelogFilePath: "",
    watchVaultChange: false,
};
var Changelog = /** @class */ (function (_super) {
    __extends(Changelog, _super);
    function Changelog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Changelog.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Loading Changelog plugin");
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new ChangelogSettingsTab(this.app, this));
                        this.addCommand({
                            id: "update",
                            name: "update",
                            callback: function () { return _this.writeChangelog(); },
                            hotkeys: [],
                        });
                        this.watchVaultChange = obsidian.debounce(this.watchVaultChange.bind(this), 200, false);
                        this.registerWatchVaultEvents();
                        return [2 /*return*/];
                }
            });
        });
    };
    Changelog.prototype.registerWatchVaultEvents = function () {
        if (this.settings.watchVaultChange) {
            this.registerEvent(this.app.vault.on("modify", this.watchVaultChange));
            this.registerEvent(this.app.vault.on("delete", this.watchVaultChange));
            this.registerEvent(this.app.vault.on("rename", this.watchVaultChange));
        }
        else {
            this.app.vault.off("modify", this.watchVaultChange);
            this.app.vault.off("delete", this.watchVaultChange);
            this.app.vault.off("rename", this.watchVaultChange);
        }
    };
    Changelog.prototype.watchVaultChange = function (file) {
        if (file.path === this.settings.changelogFilePath) {
            return;
        }
        else {
            this.writeChangelog();
        }
    };
    Changelog.prototype.writeChangelog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var changelog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changelog = this.buildChangelog();
                        return [4 /*yield*/, this.writeInFile(this.settings.changelogFilePath, changelog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Changelog.prototype.buildChangelog = function () {
        var _this = this;
        var files = this.app.vault.getMarkdownFiles();
        var recentlyEditedFiles = files
            // Remove changelog file from recentlyEditedFiles list
            .filter(function (recentlyEditedFile) {
            return recentlyEditedFile.path !== _this.settings.changelogFilePath;
        })
            .sort(function (a, b) { return (a.stat.mtime < b.stat.mtime ? 1 : -1); })
            .slice(0, this.settings.numberOfFilesToShow);
        var changelogContent = "";
        for (var _i = 0, recentlyEditedFiles_1 = recentlyEditedFiles; _i < recentlyEditedFiles_1.length; _i++) {
            var recentlyEditedFile = recentlyEditedFiles_1[_i];
            // TODO: make date format configurable (and validate it)
            var humanTime = window
                .moment(recentlyEditedFile.stat.mtime)
                .format("YYYY-MM-DD [at] HH[h]mm");
            changelogContent += "- " + humanTime + " \u00B7 [[" + recentlyEditedFile.basename + "]]\n";
        }
        return changelogContent;
    };
    Changelog.prototype.writeInFile = function (filePath, content) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.app.vault.getAbstractFileByPath(filePath);
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.app.vault.modify(file, content)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        new obsidian.Notice("Couldn't write changelog: check the file path");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Changelog.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    Changelog.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Changelog.prototype.onunload = function () {
        console.log("Unloading Changelog plugin");
    };
    return Changelog;
}(obsidian.Plugin));
var ChangelogSettingsTab = /** @class */ (function (_super) {
    __extends(ChangelogSettingsTab, _super);
    function ChangelogSettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    ChangelogSettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        var settings = this.plugin.settings;
        new obsidian.Setting(containerEl)
            .setName("Changelog note location")
            .setDesc("Changelog file absolute path (including the extension)")
            .addText(function (text) {
            text
                .setPlaceholder("Example: Folder/Changelog.md")
                .setValue(settings.changelogFilePath)
                .onChange(function (value) {
                settings.changelogFilePath = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Number of recent files in changelog")
            .setDesc("Number of most recently edited files to show in the changelog")
            .addText(function (text) {
            return text
                .setValue(String(settings.numberOfFilesToShow))
                .onChange(function (value) {
                if (!isNaN(Number(value))) {
                    settings.numberOfFilesToShow = Number(value);
                    _this.plugin.saveSettings();
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Automatically update changelog")
            .setDesc("Automatically update changelog on any vault change (modification, renaming or deletion of a note)")
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.watchVaultChange)
                .onChange(function (value) {
                _this.plugin.settings.watchVaultChange = value;
                _this.plugin.saveSettings();
                _this.plugin.registerWatchVaultEvents();
            });
        });
    };
    return ChangelogSettingsTab;
}(obsidian.PluginSettingTab));

module.exports = Changelog;


/* nosourcemap */