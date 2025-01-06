---
created: <%
tp.file.creation_date("YYYY-MM-DDTHH:mm") %>
updated: <% await tp.file.last_modified_date("YYYY-MM-DD'T'HH:mm") %>
aliases: ["<% tp.date.now("MMMM Do, YYYY", 0, tp.file.title, "YYYY.MM.DD") %>","<% tp.date.now("MMMM D, YYYY", 0, tp.file.title, "YYYY.MM.DD") %>","<% tp.date.now("MMM D, YYYY", 0, tp.file.title, "YYYY.MM.DD") %>","<% tp.date.now("MMM. D, YYYY", 0, tp.file.title, "YYYY.MM.DD") %>","<% tp.date.now("M/D/YYYY", 0, tp.file.title, "YYYY.MM.DD") %>","<% tp.date.now("M-D-YYYY", 0, tp.file.title, "YYYY.MM.DD") %>","<% tp.date.now("YYYY-MM-DD", 0, tp.file.title, "YYYY.MM.DD") %>","<% tp.date.now("M.D.YYYY", 0, tp.file.title, "YYYY.MM.DD") %>",]
tags:
- DailyNote-<% tp.file.title.split('-')[0] %>
- DailyNote
- "<% tp.file.title.split('-')[0] %>"
plugin-prettier: true
AutoNoteMover: disable
---

# 📆 <% tp.date.now("YYYY-MM-DD", 0, tp.file.title, "YYYY.MM.DD") %>

« [[<%tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>]] | [[<% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>]] »

---

>[!quote] Quote of the Day
	> I am an optimist. It does not seem too much use being anything else.
> &mdash; <cite>Winston Churchill</cite>✍️

## 🗓️ 주요 일정

```dataviewjs
const fileName = dv.current().file.name;
const dateString = fileName.split(' ')[0];
const date = new Date(dateString);
const formattedDate = moment(date).format('YYYY-MM-DD');

var events = await app.plugins.getPlugin('ics').getEvents(formattedDate);
var mdArray = [];
events.forEach((e) => {
  const urlRegex = /https?:\/\/[^\s"']+/;
  var callUrl
  if (e.callUrl) {
    const match = e.callUrl.match(urlRegex);
    callUrl = match ? match[0] : null
  }

  if (callUrl) {
    mdArray.push(`${e.time} - [${e.summary}](${callUrl})`.trim())
  } else {
    mdArray.push(`${e.time} - ${e.summary}`.trim())
  }
})
dv.list(dv.array(mdArray))
```

## ☕ Day Planner


## 📝 Tasks

### 🟨 Due Today

```tasks
not done
due on <% tp.date.now("YYYY-MM-DD", 0, tp.file.title, "YYYY.MM.DD") %>
hide recurrence rule
```

###  📔 Work


### 🆕 New Today


### ✔️ Done Today

```tasks
done on <% tp.date.now("YYYY-MM-DD", 0, tp.file.title, "YYYY.MM.DD") %>
hide done date
hide recurrence rule
hide backlink
```

## 📔 Memo


## 📝 Journal


## 📈  Invest
