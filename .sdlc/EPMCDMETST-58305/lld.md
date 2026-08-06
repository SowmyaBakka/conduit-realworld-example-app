# Low-Level Design (LLD): Popular Tags Selected-State & Clear Filter (EPMCDMETST-58305)

[Jira Story: EPMCDMETST-58305](https://jiraeu.epam.com/browse/EPMCDMETST-58305)

## FeedContext (frontend/src/context/FeedContext.jsx)
- Add new method: `clearTagFilter()`
    - If tabName !== 'tag', no-op.
    - If authed: set tabName='feed', tagName=''.
    - If guest: set tabName='global', tagName=''.
    - Exported in context.
- Extend context to expose { tabName, tagName, clearTagFilter } for consumers.

## PopularTags/TagButton (frontend/src/components/PopularTags/TagButton.jsx)
- Accepts { tabName, tagName } from context or props.
- For each rendered tag:
    - If tabName === 'tag' && tagName === this tag: add 'selected' or 'tag-active' className.
    - Else: default class.
- After tag list:
    - If tabName === 'tag', render <button class="clear-filter">Clear filter</button> wired to clearTagFilter().
- Keyboard accessibility: clear button focusable, describable (aria-label).

## styles.css
- New modifier for tag pill: '.tag-pill.selected' or '.tag-pill.tag-active'.
- '.clear-filter' style: spacing, font, visual cue consistent with tag UI, non-intrusive.

## Integration
- Ensure FeedToggler and Article List react to tagName changes on clear.
- Test clicking tag/clear reflects expected state in both sidebar & main feed.
