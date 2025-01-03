---
creation date: 2023-10-11 20:48
modification date: 수요일 11일 10월 2023 20:48:09
aliases: ["10월 11일, 2023","10월 11, 2023","10월 11, 2023","10월. 11, 2023","10/11/2023","10-11-2023","2023-10-11","10.11.2023",]
tags:
- '2023-10-11'
plugin-prettier: true
---

![[2025-01-03]]%%embed%%
%%
참고: [Dynamic (Embedded) Link for today's Daily Note - Help - Obsidian Forum](https://forum.obsidian.md/t/dynamic-embedded-link-for-todays-daily-note/68314)
%%


```dataviewjs
// Get the current file
const file = app.vault.getAbstractFileByPath(dv.current().file.path);

// Get the text contents of the current file
let contents = await app.vault.read(file);

s = contents.contains('![[' + moment().format('YYYY-MM-DD') + ']]%%embed%%');
if (s) {
  return;
}

if (dv.pages('#DailyNote-' + moment().format('YYYY-MM-DD')).file) {
  // Update any text on the line before %%embed%% to be an embedded link to today's note
  contents = contents.replace(/^.*?%%embed%%\s*$/m, '![[' + moment().format('YYYY-MM-DD') + ']]%%embed%%');
} else {
  contents = contents.replace(/^.*?%%embed%%\s*$/m, '오늘의 노트가 없습니다.');
}

// Save the new contents back to the current file
await app.vault.modify(file, contents);
```
