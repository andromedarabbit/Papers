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
  datepickerCMPlugin: () => datepickerCMPlugin,
  default: () => DatepickerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_view = require("@codemirror/view");
var DateButtonWidget = class extends import_view.WidgetType {
  toDOM() {
    const button = document.createElement("span");
    button.className = "datepicker-button";
    (0, import_obsidian.setIcon)(button, "calendar");
    return button;
  }
  ignoreEvent() {
    return false;
  }
  eq() {
    return true;
  }
};
var TimeButtonWidget = class extends import_view.WidgetType {
  toDOM() {
    const button = document.createElement("span");
    button.className = "datepicker-button";
    (0, import_obsidian.setIcon)(button, "clock");
    return button;
  }
  ignoreEvent() {
    return false;
  }
  eq() {
    return true;
  }
};
function pickerButtons(dateMatches) {
  const buttons = [];
  if (!DatepickerPlugin.settings.showDateButtons && !DatepickerPlugin.settings.showTimeButtons)
    return import_view.Decoration.set([]);
  for (const dateMatch of dateMatches) {
    if (DatepickerPlugin.settings.showDateButtons && (dateMatch.format.type === "DATE" || dateMatch.format.type === "DATETIME")) {
      let buttonDeco = import_view.Decoration.widget({
        widget: new DateButtonWidget(),
        side: -1
      });
      buttons.push(buttonDeco.range(dateMatch.from));
    } else if (DatepickerPlugin.settings.showTimeButtons && dateMatch.format.type === "TIME") {
      let buttonDeco = import_view.Decoration.widget({
        widget: new TimeButtonWidget(),
        side: -1
      });
      buttons.push(buttonDeco.range(dateMatch.from));
    }
  }
  return import_view.Decoration.set(buttons, true);
}
var DatepickerCMPlugin = class {
  constructor(view) {
    this.datepickerScrollHandler = () => {
      this.datepickerPositionHandler();
    };
    this.scrollEventAbortController = new AbortController();
    this.datepicker = void 0;
    this.dates = [];
    // flag to prevent repeatedly selecting text on every click of the datetime value, select only the first time
    this.performedSelectText = false;
    this.performingReplace = false;
    this.view = view;
    view.scrollDOM.addEventListener("scroll", this.datepickerScrollHandler.bind(this, view), { signal: this.scrollEventAbortController.signal });
    this.dates = this.getVisibleDates(view);
    this.decorations = pickerButtons(this.dates);
  }
  datepickerPositionHandler() {
    if (this.datepicker === void 0)
      return;
    this.view.requestMeasure({
      read: (state) => {
        var _a;
        let pos = state.coordsAtPos((_a = this.datepicker) == null ? void 0 : _a.cursorPosition);
        return pos;
      },
      write: (pos) => {
        if (pos) {
          this.datepicker.updatePosition({
            top: pos.top,
            left: pos.left,
            bottom: pos.bottom
          });
        }
      }
    });
  }
  get formats() {
    return this.getFormats();
  }
  getFormats() {
    const formatPatterns = [
      "YYYY-MM-DD",
      "DD.MM.YYYY",
      "MM-DD-YYYY",
      "DD-MM-YYYY",
      "MM.DD.YYYY",
      "YYYY.MM.DD",
      "YYYY/MM/DD",
      "DD/MM/YYYY",
      "MM/DD/YYYY"
    ];
    let formats = [];
    const userFormat = DatepickerPlugin.settings.dateFormat;
    const userSeparator = userFormat.includes(".") ? "\\." : userFormat.includes("/") ? "\\/" : "-";
    formatPatterns.forEach((format) => {
      const separator = format.includes(".") ? "\\." : format.includes("/") ? "\\/" : "-";
      formats.push(
        {
          regex: new RegExp(`\\d{1,4}${separator}\\d{1,2}${separator}\\d{1,4} \\d{1,2}:\\d{1,2}( )?([apm]{2})`, "ig"),
          formatToUser: `${format} hh:mm A`,
          formatToPicker: "YYYY-MM-DDTHH:mm",
          type: "DATETIME"
        },
        {
          regex: new RegExp(`\\d{1,4}${separator}\\d{1,2}${separator}\\d{1,4} \\d{1,2}:\\d{1,2}`, "g"),
          formatToUser: `${format} HH:mm`,
          formatToPicker: "YYYY-MM-DDTHH:mm",
          type: "DATETIME"
        },
        {
          regex: new RegExp(`\\d{1,4}${separator}\\d{1,2}${separator}\\d{1,4}`, "g"),
          formatToUser: format,
          formatToPicker: "YYYY-MM-DD",
          type: "DATE"
        }
      );
    });
    formats.push(
      {
        regex: /\d{1,2}:\d{1,2}( )?([apm]{2})/ig,
        formatToUser: "hh:mm A",
        formatToPicker: "HH:mm",
        type: "TIME"
      },
      {
        regex: /\d{1,2}:\d{1,2}/g,
        formatToUser: "HH:mm",
        formatToPicker: "HH:mm",
        type: "TIME"
      }
    );
    return formats;
  }
  getVisibleDates(view) {
    var _a;
    let visibleText = [];
    visibleText = view.visibleRanges.map((r) => {
      return { from: r.from, to: r.to, text: view.state.doc.sliceString(r.from, r.to) };
    });
    let matchingDate;
    const dateMatches = [];
    for (const vt of visibleText) {
      if (vt.from >= view.viewport.from && vt.to <= view.viewport.to)
        for (const format of this.formats) {
          while ((matchingDate = format.regex.exec((_a = vt.text) != null ? _a : "")) !== null) {
            const matchingDateStart = (matchingDate == null ? void 0 : matchingDate.index) + vt.from;
            const matchingDateEnd = (matchingDate == null ? void 0 : matchingDate.index) + matchingDate[0].length + vt.from;
            if (dateMatches.some((m) => matchingDateStart >= m.from && (matchingDateEnd <= m.to || matchingDateStart <= m.to)))
              continue;
            dateMatches.push({ from: matchingDate.index + vt.from, to: matchingDate.index + matchingDate[0].length + vt.from, value: matchingDate[0], format });
          }
        }
    }
    return dateMatches;
  }
  getAllDates(view) {
    let matchingDate;
    const dateMatches = [];
    const noteText = view.state.doc.toString();
    this.formats.forEach((format) => {
      while ((matchingDate = format.regex.exec(noteText)) !== null) {
        const matchingDateStart = matchingDate == null ? void 0 : matchingDate.index;
        const matchingDateEnd = (matchingDate == null ? void 0 : matchingDate.index) + matchingDate[0].length;
        if (dateMatches.some((m) => matchingDateStart >= m.from && (matchingDateEnd <= m.to || matchingDateStart <= m.to)))
          continue;
        dateMatches.push({ from: matchingDate.index, to: matchingDate.index + matchingDate[0].length, value: matchingDate[0], format });
      }
    });
    return dateMatches;
  }
  getNextMatch(view, cursorPosition) {
    const matches = this.getAllDates(view).sort((a, b) => a.from - b.from);
    return matches.find((m) => m.from > cursorPosition);
  }
  getPreviousMatch(view, cursorPosition) {
    const matches = this.getAllDates(view).sort((a, b) => b.from - a.from);
    return matches.find((m) => m.to < cursorPosition);
  }
  openDatepicker(view, match) {
    view.requestMeasure({
      read: (view2) => {
        let pos = view2.coordsAtPos(match.from);
        return pos;
      },
      write: (pos) => {
        if (!pos) {
          console.error("position is undefined");
          return;
        }
        this.datepicker = new Datepicker();
        this.datepicker.open(
          pos,
          match,
          (result) => {
            const resultFromPicker = (0, import_obsidian.moment)(result);
            if (!resultFromPicker.isValid()) {
              return;
            }
            const dateFromPicker = resultFromPicker.format(
              match.format.type === "DATETIME" ? DatepickerPlugin.settings.overrideFormat ? DatepickerPlugin.settings.dateFormat + " " + (match.format.formatToUser.includes("A") ? "hh:mm A" : "HH:mm") : match.format.formatToUser : match.format.type === "DATE" ? DatepickerPlugin.settings.overrideFormat ? DatepickerPlugin.settings.dateFormat : match.format.formatToUser : match.format.formatToUser
            );
            if (dateFromPicker === match.value)
              return;
            this.performingReplace = true;
            setTimeout(() => {
              this.performingReplace = false;
            }, 300);
            let transaction = view.state.update({
              changes: {
                from: match.from,
                to: match.to,
                insert: dateFromPicker
              }
            });
            view.dispatch(transaction);
            if (this.match !== void 0 && this.match.from !== match.from && DatepickerPlugin.settings.selectDateText) {
              const m = this.match;
              setTimeout(() => {
                view.dispatch({ selection: { anchor: m.from, head: m.to } });
              }, 0);
            }
          }
        );
      }
    });
  }
  update(update) {
    var _a;
    this.view = update.view;
    if (update.docChanged || update.geometryChanged || update.viewportChanged || update.heightChanged || this.performingReplace) {
      this.datepickerPositionHandler();
      this.dates = this.getVisibleDates(update.view);
      this.decorations = pickerButtons(this.dates);
    }
    if (update.docChanged === false && update.state.selection.main.from === update.startState.selection.main.from && update.state.selection.main.to === update.startState.selection.main.to)
      return;
    const { view } = update;
    const cursorPosition = view.state.selection.main.head;
    this.match = this.dates.find((date) => date.from <= cursorPosition && date.to >= cursorPosition);
    if (this.match) {
      const { from } = update.state.selection.main;
      const { to } = update.state.selection.main;
      if (from !== to) {
        if (from !== this.match.from || to !== this.match.to) {
          if (this.datepicker !== void 0)
            this.datepicker.respectSettingAndClose();
          return;
        }
      }
      let sameMatch = false;
      if (this.previousDateMatch !== void 0)
        sameMatch = this.previousDateMatch.from === this.match.from;
      if (this.datepicker !== void 0) {
        if (this.previousDateMatch !== void 0) {
          if (sameMatch) {
            if (((_a = this.datepicker) == null ? void 0 : _a.closedByButton) || Datepicker.escPressed || Datepicker.enterPressed)
              return;
          } else {
            this.performedSelectText = false;
            if (!Datepicker.openedByButton) {
              Datepicker.calendarImmediatelyShownOnce = false;
            } else
              Datepicker.openedByButton = false;
          }
        }
      } else
        this.performedSelectText = false;
      if (DatepickerPlugin.settings.selectDateText && !this.performedSelectText && this.match !== void 0 && (!update.docChanged || Datepicker.performedInsertCommand)) {
        setTimeout(() => view.dispatch({ selection: { anchor: this.match.from, head: this.match.to } }), 0);
        this.performedSelectText = true;
      }
      this.previousDateMatch = this.match;
      if (DatepickerPlugin.settings.showAutomatically) {
        if (Datepicker.performedInsertCommand)
          setTimeout(() => Datepicker.performedInsertCommand = false, 300);
        if (Datepicker.openedByButton)
          setTimeout(() => Datepicker.openedByButton = false, 300);
        if (!Datepicker.performedInsertCommand && !Datepicker.openedByButton && !this.performingReplace)
          setTimeout(() => this.openDatepicker(view, this.match), 0);
      }
    } else {
      Datepicker.calendarImmediatelyShownOnce = false;
      this.performedSelectText = false;
      Datepicker.performedInsertCommand = false;
      if (this.datepicker !== void 0) {
        if (this.previousDateMatch !== void 0) {
          if (cursorPosition < this.previousDateMatch.from || cursorPosition > this.previousDateMatch.to) {
            this.datepicker.respectSettingAndClose();
            this.datepicker = void 0;
          }
        }
      }
    }
  }
  destroy() {
    var _a;
    (_a = this.datepicker) == null ? void 0 : _a.respectSettingAndClose();
    this.scrollEventAbortController.abort();
  }
};
var datepickerCMPlugin = import_view.ViewPlugin.fromClass(DatepickerCMPlugin, {
  decorations: (v) => {
    return v.decorations;
  },
  eventHandlers: {
    mousedown: (e, view) => {
      datepickerButtonEventHandler(e, view);
    },
    touchend: (e, view) => {
      datepickerButtonEventHandler(e, view);
    }
  }
});
var pickerButtonsAbortController = new AbortController();
var dbounce = false;
function datepickerButtonEventHandler(e, view) {
  var _a;
  if (dbounce)
    return;
  dbounce = true;
  setTimeout(() => dbounce = false, 100);
  let target = e.target;
  const dpCMPlugin = view.plugin(datepickerCMPlugin);
  if (!dpCMPlugin)
    return;
  if (target.matches(".datepicker-button, .datepicker-button *")) {
    e.preventDefault();
    const cursorPositionAtButton = view.posAtDOM(target);
    const dateMatch = dpCMPlugin.dates.find((date) => date.from === cursorPositionAtButton);
    if (dpCMPlugin.datepicker !== void 0 && dpCMPlugin.datepicker.isOpened) {
      dpCMPlugin.datepicker.respectSettingAndClose();
      dpCMPlugin.datepicker.closedByButton = true;
    } else {
      (_a = dpCMPlugin.datepicker) == null ? void 0 : _a.respectSettingAndClose();
      Datepicker.openedByButton = true;
      Datepicker.calendarImmediatelyShownOnce = false;
      setTimeout(() => {
        if (DatepickerPlugin.settings.selectDateText)
          setTimeout(() => view.dispatch({ selection: { anchor: dateMatch.from, head: dateMatch.to } }), 0);
        dpCMPlugin.openDatepicker(view, dateMatch);
      }, 0);
    }
  }
  return true;
}
var DEFAULT_SETTINGS = {
  dateFormat: "YYYY-MM-DD",
  overrideFormat: false,
  showDateButtons: true,
  showTimeButtons: true,
  showAutomatically: false,
  autoApplyEdits: true,
  immediatelyShowCalendar: false,
  autofocus: false,
  focusOnArrowDown: false,
  insertIn24HourFormat: false,
  selectDateText: false
};
var _DatepickerPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerEditorExtension(datepickerCMPlugin);
    this.addCommand({
      id: "edit-datetime",
      name: "Edit date/time",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0) {
          new import_obsidian.Notice("Please select a date/time");
          return;
        }
        const plugin = editorView.plugin(datepickerCMPlugin);
        const match = plugin.dates.find((date) => date.from <= cursorPosition && date.to >= cursorPosition);
        if (match) {
          plugin.openDatepicker(editorView, match);
        } else
          new import_obsidian.Notice("Please select a date/time");
      }
    });
    this.addCommand({
      id: "insert-date",
      name: "Insert new date",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        const pos = editorView.coordsAtPos(cursorPosition);
        if (!pos)
          return;
        const datepicker = new Datepicker();
        const dateFormat = { regex: new RegExp(""), type: "DATE", formatToUser: "", formatToPicker: "" };
        const dateType = { from: cursorPosition, to: cursorPosition, value: "", format: dateFormat };
        datepicker.open(
          { top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom },
          dateType,
          (result) => {
            if ((0, import_obsidian.moment)(result).isValid() === true) {
              setTimeout(() => {
                Datepicker.performedInsertCommand = true;
                editorView.dispatch({
                  changes: {
                    from: cursorPosition,
                    to: cursorPosition,
                    insert: (0, import_obsidian.moment)(result).format(_DatepickerPlugin.settings.dateFormat)
                  }
                });
              }, 0);
            } else
              new import_obsidian.Notice("Please enter a valid date");
          }
        );
        datepicker.focus();
      }
    });
    this.addCommand({
      id: "insert-time",
      name: "Insert new time",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        const pos = editorView.coordsAtPos(cursorPosition);
        if (!pos)
          return;
        const datepicker = new Datepicker();
        const dateFormat = { regex: new RegExp(""), type: "TIME", formatToUser: "", formatToPicker: "" };
        const dateType = { from: cursorPosition, to: cursorPosition, value: "", format: dateFormat };
        datepicker.open(
          { top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom },
          dateType,
          (result) => {
            if ((0, import_obsidian.moment)(result, "HH:mm").isValid() === true) {
              let timeFormat;
              if (_DatepickerPlugin.settings.insertIn24HourFormat)
                timeFormat = "HH:mm";
              else
                timeFormat = "hh:mm A";
              setTimeout(() => {
                Datepicker.performedInsertCommand = true;
                editorView.dispatch({
                  changes: {
                    from: cursorPosition,
                    to: cursorPosition,
                    insert: (0, import_obsidian.moment)(result).format(timeFormat)
                  }
                });
              }, 25);
            } else
              new import_obsidian.Notice("Please enter a valid time");
          }
        );
        datepicker.focus();
      }
    });
    this.addCommand({
      id: "insert-datetime",
      name: "Insert new date and time",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        const pos = editorView.coordsAtPos(cursorPosition);
        if (!pos)
          return;
        const datepicker = new Datepicker();
        const dateFormat = { regex: new RegExp(""), type: "DATETIME", formatToUser: "", formatToPicker: "" };
        const dateType = { from: cursorPosition, to: cursorPosition, value: "", format: dateFormat };
        datepicker.open(
          { top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom },
          dateType,
          (result) => {
            if ((0, import_obsidian.moment)(result).isValid() === true) {
              let timeFormat;
              if (_DatepickerPlugin.settings.insertIn24HourFormat)
                timeFormat = "HH:mm";
              else
                timeFormat = "hh:mm A";
              setTimeout(() => {
                Datepicker.performedInsertCommand = true;
                editorView.dispatch({
                  changes: {
                    from: cursorPosition,
                    to: cursorPosition,
                    insert: (0, import_obsidian.moment)(result).format(_DatepickerPlugin.settings.dateFormat + " " + timeFormat)
                  }
                });
              }, 25);
            } else
              new import_obsidian.Notice("Please enter a valid date and time");
          }
        );
        datepicker.focus();
      }
    });
    this.addCommand({
      id: "insert-current-time",
      name: "Insert current time",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        let timeFormat;
        if (_DatepickerPlugin.settings.insertIn24HourFormat)
          timeFormat = "HH:mm";
        else
          timeFormat = "hh:mm A";
        Datepicker.performedInsertCommand = true;
        editorView.dispatch({
          changes: {
            from: cursorPosition,
            to: cursorPosition,
            insert: (0, import_obsidian.moment)().format(timeFormat)
          }
        });
      }
    });
    this.addCommand({
      id: "insert-current-datetime",
      name: "Insert current date and time",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        let timeFormat;
        if (_DatepickerPlugin.settings.insertIn24HourFormat)
          timeFormat = "HH:mm";
        else
          timeFormat = "hh:mm A";
        Datepicker.performedInsertCommand = true;
        editorView.dispatch({
          changes: {
            from: cursorPosition,
            to: cursorPosition,
            insert: (0, import_obsidian.moment)().format(_DatepickerPlugin.settings.dateFormat + " " + timeFormat)
          }
        });
      }
    });
    this.addCommand({
      id: "insert-current-date",
      name: "Insert current date",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        Datepicker.performedInsertCommand = true;
        editorView.dispatch({
          changes: {
            from: cursorPosition,
            to: cursorPosition,
            insert: (0, import_obsidian.moment)().format(_DatepickerPlugin.settings.dateFormat)
          }
        });
      }
    });
    this.addCommand({
      id: "select-next-datetime",
      name: "Select next date/time",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        const dpCMPlugin = editorView.plugin(datepickerCMPlugin);
        if (!dpCMPlugin)
          return;
        const match = dpCMPlugin.getNextMatch(editorView, cursorPosition);
        if (match) {
          editorView.dispatch({
            selection: {
              anchor: match.from,
              head: match.from
            },
            scrollIntoView: true
          });
        } else
          new import_obsidian.Notice("No next date/time found");
      }
    });
    this.addCommand({
      id: "select-previous-datetime",
      name: "Select previous date/time",
      editorCallback: (editor) => {
        const editorView = editor.cm;
        const cursorPosition = editorView.state.selection.main.to;
        if (cursorPosition === void 0)
          return;
        const dpCMPlugin = editorView.plugin(datepickerCMPlugin);
        if (!dpCMPlugin)
          return;
        const match = dpCMPlugin.getPreviousMatch(editorView, cursorPosition);
        if (match) {
          editorView.dispatch({
            selection: {
              anchor: match.from,
              head: match.from
            },
            scrollIntoView: true
          });
        } else
          new import_obsidian.Notice("No previous date/time found");
      }
    });
    this.addSettingTab(new DatepickerSettingTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on(
        "active-leaf-change",
        (event) => {
          var _a;
          const editor = (_a = event == null ? void 0 : event.view.app.workspace.activeEditor) == null ? void 0 : _a.editor;
          if (!editor)
            return;
          const editorView = editor.cm;
          const dpCMPlugin = editorView.plugin(datepickerCMPlugin);
          if (!dpCMPlugin)
            return;
          let delay = 350;
          setTimeout(() => {
            const { match } = dpCMPlugin;
            if (match !== void 0) {
              if (_DatepickerPlugin.settings.selectDateText)
                editorView.dispatch({ selection: { anchor: match.from, head: match.to } });
              if (_DatepickerPlugin.settings.showAutomatically)
                dpCMPlugin.openDatepicker(editorView, match);
            }
          }, delay);
          Datepicker.escPressed = false;
          Datepicker.calendarImmediatelyShownOnce = false;
        }
      )
    );
  }
  onunload() {
  }
  async loadSettings() {
    _DatepickerPlugin.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(_DatepickerPlugin.settings);
  }
};
var DatepickerPlugin = _DatepickerPlugin;
DatepickerPlugin.settings = DEFAULT_SETTINGS;
var _Datepicker = class {
  constructor() {
    this.submited = false;
    this.isOpened = false;
    this.closedByButton = false;
    this.close();
  }
  updatePosition(pos) {
    const left = pos.left - this.viewContainer.getBoundingClientRect().left;
    if (left + this.pickerContainer.offsetWidth > this.viewContainer.offsetWidth)
      this.pickerContainer.style.left = left - (left + this.pickerContainer.offsetWidth - this.viewContainer.offsetWidth) + "px";
    else
      this.pickerContainer.style.left = left + "px";
    const leafTop = this.viewContainer.closest(".workspace-leaf-content").getBoundingClientRect().top;
    if (pos.bottom - leafTop > this.viewContainer.offsetHeight)
      this.pickerContainer.style.top = pos.top - leafTop - this.pickerContainer.offsetHeight + "px";
    else
      this.pickerContainer.style.top = pos.bottom - leafTop + "px";
  }
  focus() {
    setTimeout(() => this.pickerInput.focus(), 250);
  }
  close() {
    let datepickers = activeDocument.getElementsByClassName("datepicker-container");
    for (var i = 0; i < datepickers.length; i++) {
      datepickers[i].remove();
    }
    this.isOpened = false;
    setTimeout(() => {
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        bubbles: true
      });
      activeDocument.dispatchEvent(escapeEvent);
    }, 50);
  }
  respectSettingAndClose() {
    if (DatepickerPlugin.settings.autoApplyEdits)
      this.submitAndClose();
    else
      this.close();
  }
  submitAndClose() {
    this.submit();
    this.close();
  }
  submit() {
    if (this.submited || _Datepicker.escPressed || !this.isOpened)
      return;
    this.submited = true;
    let submitValue = this.pickerInput.value;
    if (submitValue.length === 0)
      return;
    if ((0, import_obsidian.moment)(submitValue).format(this.datetime.format.formatToUser) === this.datetime.value)
      return;
    if (this.datetime.format.type === "TIME")
      submitValue = (0, import_obsidian.moment)().format("YYYY-MM-DD") + "T" + this.pickerInput.value;
    setTimeout(() => this.onSubmit(submitValue), 0);
  }
  open(pos, datetime, onSubmit) {
    var _a, _b;
    this.onSubmit = onSubmit;
    this.datetime = datetime;
    this.cursorPosition = datetime.from;
    this.closedByButton = false;
    _Datepicker.escPressed = false;
    _Datepicker.enterPressed = false;
    this.viewContainer = (_a = activeDocument.querySelector(".workspace-leaf.mod-active")) == null ? void 0 : _a.querySelector(".cm-editor");
    if (!this.viewContainer) {
      console.error("Could not find view container");
      return;
    }
    this.pickerContainer = this.viewContainer.createEl("div");
    this.pickerContainer.className = "datepicker-container";
    this.pickerContainer.id = "datepicker-container";
    this.pickerInput = this.pickerContainer.createEl("input");
    if (datetime.format.type === "TIME")
      this.pickerInput.type = "time";
    else if (datetime.format.type === "DATE")
      this.pickerInput.type = "date";
    else if (datetime.format.type === "DATETIME")
      this.pickerInput.type = "datetime-local";
    this.pickerInput.id = "datepicker-input";
    this.pickerInput.className = "datepicker-input";
    this.pickerInput.value = (0, import_obsidian.moment)(datetime.value, [
      "YYYY-MM-DD hh:mm A",
      "YYYY-MM-DDThh:mm",
      "YYYY-MM-DD hh:mma",
      "YYYY.MM.DD HH:mm",
      "YYYY-MM-DD",
      "DD-MM-YYYY HH:mm",
      "DD-MM-YYYY hh:mm A",
      "DD-MM-YYYY hh:mma",
      "DD-MM-YYYY",
      "hh:mm A",
      "HH:mm"
    ], false).format(datetime.format.formatToPicker);
    const acceptButton = this.pickerContainer.createEl("button");
    acceptButton.className = "datepicker-container-button";
    (0, import_obsidian.setIcon)(acceptButton, "check");
    const buttonEventAbortController = new AbortController();
    const acceptButtonEventHandler = (event) => {
      if (this.pickerInput.value === "") {
        new import_obsidian.Notice("Please enter a valid date");
      } else {
        _Datepicker.enterPressed = true;
        this.submitAndClose();
        buttonEventAbortController.abort();
      }
    };
    acceptButton.addEventListener("click", acceptButtonEventHandler, { signal: buttonEventAbortController.signal });
    acceptButton.addEventListener("touchend", acceptButtonEventHandler, { signal: buttonEventAbortController.signal });
    const cancelButton = this.pickerContainer.createEl("button");
    cancelButton.className = "datepicker-container-button";
    (0, import_obsidian.setIcon)(cancelButton, "x");
    function cancelButtonEventHandler(event) {
      event.preventDefault();
      _Datepicker.escPressed = true;
      this.close();
      buttonEventAbortController.abort();
    }
    cancelButton.addEventListener("click", cancelButtonEventHandler.bind(this), { signal: buttonEventAbortController.signal });
    cancelButton.addEventListener("touchend", cancelButtonEventHandler.bind(this), { signal: buttonEventAbortController.signal });
    const controller = new AbortController();
    const keypressHandler = (event) => {
      if (event.key === "ArrowDown") {
        if (DatepickerPlugin.settings.focusOnArrowDown) {
          event.preventDefault();
          this.focus();
          controller.abort();
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        _Datepicker.escPressed = true;
        this.close();
        controller.abort();
      }
    };
    (_b = this.pickerContainer.parentElement) == null ? void 0 : _b.addEventListener("keydown", keypressHandler, { signal: controller.signal, capture: true });
    this.pickerInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (this.pickerInput.value === "") {
          new import_obsidian.Notice("Please enter a valid date/time");
        } else {
          _Datepicker.enterPressed = true;
          this.submitAndClose();
        }
      }
      if (event.key === "Escape") {
        _Datepicker.escPressed = true;
        this.close();
      }
    }, { capture: true });
    const blurEventHandler = () => {
      setTimeout(() => {
        if (!this.submited && !_Datepicker.escPressed && !_Datepicker.enterPressed && DatepickerPlugin.settings.autoApplyEdits)
          this.submit();
      }, 300);
    };
    this.pickerInput.addEventListener("blur", blurEventHandler);
    this.updatePosition(pos);
    if (import_obsidian.Platform.isMobile) {
      this.pickerInput.addEventListener("touchstart", (e) => {
        e.preventDefault();
      });
      this.pickerInput.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.pickerInput.showPicker();
      });
    }
    if (DatepickerPlugin.settings.autofocus) {
      if (!import_obsidian.Platform.isMobile)
        this.focus();
      else if (!DatepickerPlugin.settings.immediatelyShowCalendar)
        this.focus();
    }
    const click = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: activeWindow
    });
    if (DatepickerPlugin.settings.immediatelyShowCalendar) {
      if (_Datepicker.calendarImmediatelyShownOnce)
        return;
      if (import_obsidian.Platform.isMobile) {
        this.pickerInput.focus();
        setTimeout(() => {
          this.pickerInput.dispatchEvent(click);
          _Datepicker.calendarImmediatelyShownOnce = true;
        }, 150);
      } else {
        this.focus();
        setTimeout(() => {
          this.pickerInput.showPicker();
          _Datepicker.calendarImmediatelyShownOnce = true;
        }, 500);
      }
    }
    this.isOpened = true;
  }
};
var Datepicker = _Datepicker;
Datepicker.escPressed = false;
Datepicker.openedByButton = false;
// prevents reopening the datepicker on the just inserted date
Datepicker.performedInsertCommand = false;
// Used for preventing the calendar from continuously reopening on every
// interaction with the datefield when set to immediatelyShowCalendar
Datepicker.calendarImmediatelyShownOnce = false;
// Used for preventing blur event from inserting date twice
Datepicker.enterPressed = false;
var DatepickerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl: settingsContainerElement } = this;
    settingsContainerElement.empty();
    new import_obsidian.Setting(settingsContainerElement).setName("Date Format").setDesc("Choose your preferred date format for inserting new dates").addDropdown((dropdown) => dropdown.addOption("YYYY-MM-DD", "YYYY-MM-DD").addOption("DD.MM.YYYY", "DD.MM.YYYY").addOption("MM-DD-YYYY", "MM-DD-YYYY").addOption("DD-MM-YYYY", "DD-MM-YYYY").addOption("MM.DD.YYYY", "MM.DD.YYYY").addOption("YYYY.MM.DD", "YYYY.MM.DD").addOption("YYYY/MM/DD", "YYYY/MM/DD").addOption("DD/MM/YYYY", "DD/MM/YYYY").addOption("MM/DD/YYYY", "MM/DD/YYYY").setValue(DatepickerPlugin.settings.dateFormat).onChange(async (value) => {
      DatepickerPlugin.settings.dateFormat = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Use date format when modifying existing dates").setDesc("Use the selected date format when modifying existing dates").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.overrideFormat).onChange(async (value) => {
      DatepickerPlugin.settings.overrideFormat = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Insert new time in 24 hour format").setDesc('Insert time in 24 hour format when performing "Insert new time" and "Insert new date and time" commands').addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.insertIn24HourFormat).onChange(async (value) => {
      DatepickerPlugin.settings.insertIn24HourFormat = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Show a picker button for dates").setDesc("Shows a button with a calendar icon associated with date values, select it to open the picker (Reloading Obsidian may be required)").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.showDateButtons).onChange(async (value) => {
      DatepickerPlugin.settings.showDateButtons = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Show a picker button for times").setDesc("Shows a button with a clock icon associated with time values, select it to open the picker (Reloading Obsidian may be required)").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.showTimeButtons).onChange(async (value) => {
      DatepickerPlugin.settings.showTimeButtons = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Show automatically").setDesc("Datepicker will show automatically whenever a date/time value is selected").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.showAutomatically).onChange(async (value) => {
      DatepickerPlugin.settings.showAutomatically = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Auto apply edits").setDesc("Will automatically apply edits made to the date when the datepicker closes or loses focus").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.autoApplyEdits).onChange(async (value) => {
      DatepickerPlugin.settings.autoApplyEdits = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Immediately show calendar").setDesc("Immediately show the calendar when the datepicker opens").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.immediatelyShowCalendar).onChange(async (value) => {
      DatepickerPlugin.settings.immediatelyShowCalendar = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Autofocus").setDesc("Automatically focus the datepicker whenever the datepicker opens").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.autofocus).onChange(async (value) => {
      DatepickerPlugin.settings.autofocus = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Focus on pressing down arrow key").setDesc("Focuses the datepicker when the down arrow keyboard key is pressed").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.focusOnArrowDown).onChange(async (value) => {
      DatepickerPlugin.settings.focusOnArrowDown = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingsContainerElement).setName("Select date/time text").setDesc("Automatically select the entire date/time text when a date/time is selected").addToggle((toggle) => toggle.setValue(DatepickerPlugin.settings.selectDateText).onChange(async (value) => {
      DatepickerPlugin.settings.selectDateText = value;
      await this.plugin.saveSettings();
    }));
  }
};

/* nosourcemap */