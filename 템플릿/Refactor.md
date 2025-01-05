---
created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm") %>
updated: <% await tp.file.last_modified_date("YYYY-MM-DD'T'HH:mm") %>
aliases: ["<% tp.date.now("MMMM Do, YYYY", 0) %>","<% tp.date.now("MMMM D, YYYY") %>","<% tp.date.now("MMM D, YYYY") %>","<% tp.date.now("MMM. D, YYYY") %>","<% tp.date.now("M/D/YYYY") %>","<% tp.date.now("M-D-YYYY") %>","<% tp.date.now("YYYY-MM-DD") %>","<% tp.date.now("M.D.YYYY") %>",]
tags:
- '<% tp.file.creation_date("YYYY-MM-DD") %>'
plugin-prettier: true
from: [[{{fromTitle}}]]
---

# `=this.file.name`

{{content}}
