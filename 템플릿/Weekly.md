---
aliases:
  - weekly
tags:
  - week/weekly
plugin-prettier: true
---

# weekly

## Tasks available

```dataview
table dueDate, project, completed, assignedDate
from "tasks"
where
	(completed = "" or completed = "N") and
	(
		assignedDate = "" or
		assignedDate = date(1970-01-01)
	)
sort dueDate asc
```

## Weekly planner

### Recurring Tasks
- 

### Assigned tasks

```dataview
table dueDate, project, completed, assignedDate
from "tasks"
where
	(completed = "" or completed = "N")
	and (
		assignedDate <= date({{sunday:gggg-MM-DD}}) and
		assignedDate >= date({{monday:gggg-MM-DD}})
	)
sort dueDate asc
```


### Week at a Glance

[Monday](days/{{monday:gggg-MM-DD}})
[Tuesday](days/{{tuesday:gggg-MM-DD}})
[Wednesday](days/{{wednesday:gggg-MM-DD}})
[Thursday](days/{{thursday:gggg-MM-DD}})
[Friday](days/{{friday:gggg-MM-DD}})
[Saturday](days/{{saturday:gggg-MM-DD}})
[Sunday](days/{{sunday:gggg-MM-DD}})