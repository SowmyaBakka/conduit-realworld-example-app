import { useFeedContext } from "../../context/FeedContext";

function TagButton({ tagsList }) {
  const { changeTab, clearTagFilter, tabName, tagName } = useFeedContext();

  const handleClick = (e) => {
    changeTab(e, "tag");
  };

  const handleClearFilter = () => {
    clearTagFilter();
  };

  return (
    <>
      {tagsList.slice(0, 50).map((name) => {
        const isSelected = tabName === "tag" && tagName === name;
        const className = isSelected
          ? "tag-pill tag-default tag-selected"
          : "tag-pill tag-default";

        return (
          <button className={className} key={name} onClick={handleClick}>
            {name}
          </button>
        );
      })}
      {tabName === "tag" && (
        <button
          className="clear-filter"
          onClick={handleClearFilter}
          aria-label="Clear tag filter"
        >
          Clear filter
        </button>
      )}
    </>
  );
}

export default TagButton;
