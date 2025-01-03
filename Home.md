---
tags:
  - Home
  - "2023"
  - "2023-01-26"
plugin-prettier: true
---

# 📆 <%+ tp.file.title %>

> Just be patient. Let the game come to you. Don't rush. Be quick, but don't hurry.
> — <cite>Earl Monroe</cite>

## 📝 Tasks
### 🟥 Overdue
```tasks
not done
due before 2022-09-15
hide recurrence rule
```

### 🟨 Due Today
```tasks
not done
due on 2022-09-15
hide recurrence rule
```

### 🟧 Due Soon
```tasks
not done
due after 2022-09-15
due before 2022-09-23
hide recurrence rule
```

### 🟩 Due Later

```tasks
not done
is not recurring
due after 2022-09-22
```

### ❓ No Due Date
```tasks
not done
no due date
heading does not include Wishlist
heading does not include 업무
heading does not include Work
heading does not include 딥서치
description does not include Wishlist
description does not include 업무
description does not include Work
description does not include 딥서치
tags does not include empty
tags does not include 업무
tags does not include work
tags does not include 딥서치
tags does not include notask
tags does not include notodo
path does not include 업무
path does not include 딥서치
path does not include Archive
path does not include Excalidraw
path does not include 템플릿
path does not include 첨부파일
path does not include Checklist
path does not include 체크리스트
sort by due
sort by urgency
sort by priority
group by folder
# Uncomment the following line to enable short mode:
shortmode
```

###  📔 Work

```dataview
task
where (contains(text, "#업무") OR contains(tags, "#업무") OR contains(string(section), "업무") OR contains(text, "#work") OR contains(tags, "#work") OR contains(string(section), "Work") OR contains(text, "#딥서치") OR contains(text, "#우아한형제들") OR contains(tags, "#우아한형제들") OR contains(string(section), "우아한형제들")) AND (!contains(path, "Archive") AND !contains(path, "템플릿") AND !contains(path, "Checklist") AND !contains(path, "체크리스트"))
and !completed and status != "-"
where !contains(file.tags, "#notodo") AND !contains(file.tags, "#notask") AND !contains(file.tags, "#done")
group by file.folder
sort due-date
sort urgency
sort priority
```

### 🆕 New Today

```tasks
done on today
hide done date
hide recurrence rule
hide backlink
```

## 🎁 Wishlist

```dataview
task
where ( contains(text, "#Wishlist") OR contains(tags, "#Wishlist") OR contains(string(section), "Wishlist") OR contains(text, "#위시리스트") OR contains(tags, "#위시리스트") OR contains(string(section), "위시리스트") ) AND (!contains(path, "Archive") AND !contains(path, "템플릿") AND !contains(path, "Excalidraw") AND !contains(path, "킨들") AND !contains(path, "트윗") AND !contains(path, "첨부파일"))
and !completed and status != "-"
where !contains(file.tags, "#notodo") AND !contains(file.tags, "#notask") AND !contains(file.tags, "#empty")
group by file.folder
sort due-date
sort urgency
sort priority
```

```dataview
LIST WITHOUT ID "📩 " +  file.link
FROM ""
WHERE contains(file.frontmatter.tags, "wishlist")
AND !contains(file.frontmatter.tags, "done")
AND !contains(file.frontmatter.tags, "notodo")
AND !contains(file.frontmatter.tags, "notask")
AND contains(file.path, "Archive/") = false
```

```tasks
not done
hide done date
heading includes Wishlist
description does not include #empty
path does not include Archive
path does not include Excalidraw
path does not include 킨들
path does not include 템플릿
path does not include 트윗
path does not include 첨부파일
path does not include 2022-09-15
sort by due-date
sort by urgency
sort by priority
```

## 📰 Review

```dataview
LIST WITHOUT ID "📩 " +  file.link
FROM ""
WHERE ( contains(file.frontmatter.tags, "todo") OR contains(file.frontmatter.tags, "toreview") )
AND !contains(file.frontmatter.tags, "done")
AND !contains(file.frontmatter.tags, "notodo")
AND !contains(file.frontmatter.tags, "notask")
AND contains(file.path, "Archive/") = false
```

## 💡 Ideas

```dataview
task
where ( contains(text, "#idea") OR contains(tags, "#idea") OR contains(text, "#아이디어") OR contains(tags, "#아이디어") OR contains(string(section), "Ideas") OR contains(string(section), "Ideas") ) AND (!contains(path, "Archive") AND !contains(path, "템플릿") AND !contains(path, "Excalidraw") AND !contains(path, "킨들") AND !contains(path, "트윗") AND !contains(path, "첨부파일"))
and !completed and status != "-"
where !contains(file.tags, "#notodo") AND !contains(file.tags, "#notask") AND !contains(file.tags, "#empty")
group by file.folder
sort due-date
sort urgency
sort priority
```

```dataview
LIST WITHOUT ID "📩 " +  file.link
FROM ""
WHERE contains(file.frontmatter.tags, "아이디어")
AND !contains(file.frontmatter.tags, "done")
AND !contains(file.frontmatter.tags, "notodo")
AND !contains(file.frontmatter.tags, "notask")
AND contains(file.path, "Archive/") = false
```

## 📎 Drafts
```tasks
not done
hide done date
heading includes Drafts
description does not include #empty
path does not include Archive
path does not include Excalidraw
path does not include 킨들
path does not include 템플릿
path does not include 트윗
path does not include 첨부파일
path does not include 2022-09-15
sort by urgency
sort by priority
```

## 📔 Memo

```dataview
LIST WITHOUT ID "📩 " +  file.link
FROM ""
WHERE ( contains(file.frontmatter.tags, "memo") OR contains(file.frontmatter.tags, "메모") )
AND !contains(file.frontmatter.tags, "done")
AND !contains(file.frontmatter.tags, "notodo")
AND !contains(file.frontmatter.tags, "notask")
AND contains(file.path, "Archive/") = false
```

## 🕖 Recent Activity

Up to 10 files only.

```dataview
LIST WITHOUT ID "📩 " +  file.link
FROM ""
WHERE striptime(file.mtime) = striptime(file.ctime)
AND contains(file.tags, "DailyNote") = false
AND contains(file.path, "Archive/") = false
SORT file.name
LIMIT 10
```

---
Creation Date:: [<%+ tp.file.creation_date("YYYY-MM-DD") %>](<%+%20tp.file.creation_date("YYYY-MM-DD")%20%>) <%+ tp.file.creation_date("HH:mm") %>

Modification Date::  [<%+ tp.file.last_modified_date("YYYY-MM-DD") %>](<%+%20tp.file.last_modified_date("YYYY-MM-DD")%20%>)  <%+ tp.file.last_modified_date("HH:mm") %> <!-- This doesn't currently work in front matter, hoping that gets fixed. -->