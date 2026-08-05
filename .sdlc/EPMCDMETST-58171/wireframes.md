# Wireframes — EPMCDMETST-58171

Jira: **EPMCDMETST-58171**  
Epic: **EPMCDMETST-58170**

## Article Editor (Create / Edit)

### Default state
```
+--------------------------------------------------+
| New Article                                      |
+--------------------------------------------------+
| [ Title ....................................... ]|
| [ Description ................................. ]|
| [ Body (markdown) ............................. ]|
| [ Tag list .................................... ]|
|                                                  |
|                                    ( Publish )   |
+--------------------------------------------------+
```

### Submitting (Create)
- Publish button disabled
- Label changes to Publishing…

```
+--------------------------------------------------+
| New Article                                      |
+--------------------------------------------------+
| [ Title ....................................... ]|
| [ Description ................................. ]|
| [ Body (markdown) ............................. ]|
| [ Tag list .................................... ]|
|                                                  |
|                              ( Publishing… )     |
|                               [disabled]         |
+--------------------------------------------------+
```

### Submitting (Edit)
- Update button disabled
- Label changes to Updating…

```
+--------------------------------------------------+
| Edit Article                                     |
+--------------------------------------------------+
| [ Title ....................................... ]|
| [ Description ................................. ]|
| [ Body (markdown) ............................. ]|
| [ Tag list .................................... ]|
|                                                  |
|                               ( Updating… )      |
|                                [disabled]        |
+--------------------------------------------------+
```

### Error state (after failed submit)
- Error summary displayed above inputs

```
+--------------------------------------------------+
| New Article                                      |
+--------------------------------------------------+
| Errors:
|  - title can't be blank
|  - body can't be blank
|--------------------------------------------------|
| [ Title ....................................... ]|
| [ Description ................................. ]|
| [ Body (markdown) ............................. ]|
| [ Tag list .................................... ]|
|                                                  |
|                                    ( Publish )   |
+--------------------------------------------------+
```

### Retry behavior
- When user clicks Publish/Update again, previous errors disappear immediately (cleared at submit start).
