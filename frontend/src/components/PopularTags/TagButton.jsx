import { useFeedContext } from "../../context/FeedContext";

function TagButton({ tagsList }) {
  const { setFeed } = useFeedContext();

  const handleClick = (tagName) => {
    setFeed({ tabName: "tag", tagName });
  };

  return tagsList.slice(0, 50).map((name) => (
    <button
      className="tag-pill tag-default"
      key={name}
      onClick={() => handleClick(name)}
    >
      {name}
    </button>
  ));
}

export default TagButton;
