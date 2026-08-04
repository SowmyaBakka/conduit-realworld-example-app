# Wireframes — EPMCDMETST-57770

## Design principles
- Keep UI changes minimal and consistent with existing Conduit styling.
- Selector should be discoverable but not visually dominant.
- Use native `<select>` for accessibility.

## A) Home page (Global/Your/Tag feeds)

### Placement
Within the feed header area (near the tabs), add a small control aligned to the right.

### ASCII wireframe
```
+--------------------------------------------------------------+
| [Your Feed] [Global Feed] [Tag: react]        Articles/page: |
|                                               [ 3  v ]       |
+--------------------------------------------------------------+
| Article Preview Card #1                                       |
| Article Preview Card #2                                       |
| Article Preview Card #3                                       |
+--------------------------------------------------------------+
| < 1 2 3 ... >    (pagination uses limit)                      |
+--------------------------------------------------------------+
```

### Interaction notes
- Default selector value: 3.
- Changing selector:
  - resets to page 1
  - refetches and updates list
  - updates pagination page count

## B) Profile page (My Articles / Favorited Articles)

### Placement
In the profile’s article toggle header row, add the selector on the right.

### ASCII wireframe
```
+--------------------------------------------------------------+
| Profile Header (user info)                                    |
+--------------------------------------------------------------+
| [My Articles] [Favorited Articles]          Articles/page:    |
|                                            [ 10 v ]          |
+--------------------------------------------------------------+
| Article Preview Card #1                                       |
| ... up to limit ...                                           |
+--------------------------------------------------------------+
| < 1 2 ... >                                                   |
+--------------------------------------------------------------+
```

## Responsive behavior
- On narrow widths:
  - Stack selector below tabs, full-width select.

### Mobile wireframe
```
[Your Feed] [Global Feed]
[Tag: react]
Articles per page
[ 3 v ]

(articles...)
(pagination...)
```

## Copy / labels
- Label: “Articles per page” (or shorter “Per page” if space constrained).
- Options: 3, 10, 20.
