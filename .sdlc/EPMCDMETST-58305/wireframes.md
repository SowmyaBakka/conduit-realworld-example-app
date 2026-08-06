# Wireframes: Popular Tags selected-state + clear filter (EPMCDMETST-58305)

[Jira Story: EPMCDMETST-58305](https://jiraeu.epam.com/browse/EPMCDMETST-58305)

## Sidebar (PopularTags)

**Before tag selected:**
```
+-------------------+
| Popular Tags      |
| ----------------- |
| [dragons] [react] |
| [angular] [more]  |
|                   |
+-------------------+
```

**After [react] selected:**
```
+-------------------+
| Popular Tags      |
| ----------------- |
| [dragons] [react]*|
| [angular] [more]  |
|                   |
| [Clear filter]    |
+-------------------+
```
(* = highlighted pill)

## Details
- Tag pill for current tag is visually highlighted (see styles.css design).
- 'Clear filter' appears only when a tag is selected.
- Keyboard: clear control is focusable after tag sequence.

## FeedToggler reference
- No changes to feed toggler, except tag tab appears as today when tag is active.
