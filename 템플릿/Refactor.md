---
creation date: <% tp.file.creation_date() %>
modification date: <% await tp.file.last_modified_date("dddd Do MMMM YYYY HH:mm:ss") %>
aliases: ["<% tp.date.now("MMMM Do, YYYY", 0) %>","<% tp.date.now("MMMM D, YYYY") %>","<% tp.date.now("MMM D, YYYY") %>","<% tp.date.now("MMM. D, YYYY") %>","<% tp.date.now("M/D/YYYY") %>","<% tp.date.now("M-D-YYYY") %>","<% tp.date.now("YYYY-MM-DD") %>","<% tp.date.now("M.D.YYYY") %>",]
tags: 
- '<% tp.file.creation_date("YYYY-MM-DD") %>'
plugin-prettier: true
from: [[{{fromTitle}}]]
---

# `=this.file.name`

{{content}}

---
Creation Date::  `=dateformat(this.file.ctime, "[[yyyy-MM-dd]]")` `=dateformat(this.file.ctime, "HH:mm")`
Modification Date:: `=dateformat(this.file.mtime, "[[yyyy-MM-dd]]")` `=dateformat(this.file.mtime, "HH:mm")`