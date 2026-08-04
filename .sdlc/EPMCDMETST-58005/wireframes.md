# Wireframes — Client-side article list search (EPMCDMETST-58005)

## 1) Home feed (`/`)

```
+------------------------------------------------------+
| Conduit                                               |
| [Your Feed] [Global Feed] [# tag]                     |
+------------------------------------------------------+
| Search articles: [__________________________] [Clear] |
+------------------------------------------------------+
| Article Preview Item                                  |
|  - Title (with highlight)                             |
|  - Description (with highlight)                       |
|  - Author + date  [♥ 12]                              |
|  - Tags: tag1 tag2                                    |
+------------------------------------------------------+
| Article Preview Item                                  |
+------------------------------------------------------+
| (Pagination shown only when query is empty)           |
|  [1] [2] [3] ...                                      |
+------------------------------------------------------+

Empty state when searching and no results:

+------------------------------------------------------+
| Search articles: [some query______________] [Clear]   |
+------------------------------------------------------+
| No articles match your search.                        |
+------------------------------------------------------+
```

Notes
- Clear button appears only when query non-empty.
- Pagination hidden/disabled when query non-empty.

## 2) Profile articles (`/profile/:username`)

```
+------------------------------------------------------+
| Profile Header: username                              |
| [Follow/Unfollow]                                     |
+------------------------------------------------------+
| Search articles: [__________________________] [Clear] |
+------------------------------------------------------+
| [My Articles] [Favorited Articles]                    |
+------------------------------------------------------+
| Article Preview Item (highlight in title/desc)        |
+------------------------------------------------------+
| (Pagination shown only when query is empty)           |
+------------------------------------------------------+
```

## 3) Profile favorites (`/profile/:username/favorites`)

Same as Profile articles, with Favorited tab active.

## 4) Article preview highlight visual

```
Title:  "How to build a <mark>React</mark> app"
Desc :  "A quick intro to <mark>react</mark> hooks..."

(Highlight is case-insensitive; original text casing preserved.)
```

## Responsive behavior
- Input uses existing `.form-control` styling, full-width on small screens.
- Clear button wraps to next line if needed.
