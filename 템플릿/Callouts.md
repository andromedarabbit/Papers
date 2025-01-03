---
source url: https://github.com/lguenth/obsidian-templates?tab=readme-ov-file
---

<%*
// Choose a callout from a suggester
// Grouped by color

const types = ["🟦", "Note", "Abstract", "Summary", "TLDR", "Info", "Todo", "Tip", "Hint", "Important", "🟩", "Success", "Check", "Done", "Question", "Help", "FAQ", "🟨", "Warning", "Caution", "Attention", "🟧", "Failure", "Fail", "Missing", "🟥", "Danger", "Error", "Bug", "🟪", "Example", "⬛️", "Quote", "Cite"];

const callouts = ["Blue", "> [!note]", "> [!abstract]", "> [!summary]", "> [!tldr]", "> [!info]", "> [!todo]", "> [!tip]", "> [!hint]", "> [!important]", "Green", "> [!success]", "> [!check]", "> [!done]", "> [!question]", "> [!help]", "> [!faq]", "Yellow", "> [!warning]", "> [!caution]", "> [!attention]", "Orange", "> [!failure]", "> [!fail]", "> [!missing]", "Red", "> [!danger]", "> [!error]", "> [!bug]", "Pink", "> [!example]", "Black", "> [!quote]", "> [!cite]"];

let suggest = await tp.system.suggester(types, callouts);
if (suggest == "null" || /Blue|Green|Yellow|Orange|Red|Pink|Black/.test(suggest)) {return ""};
return suggest;
%>