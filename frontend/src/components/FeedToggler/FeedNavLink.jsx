import { useFeedContext } from "../../context/FeedContext";

function FeedNavLink({ icon, name, text }) {
  const { tabName, setFeed } = useFeedContext();

  const handleClick = () => {
    setFeed({ tabName: name });
  };

  return (
    <li className="nav-item">
      <button
        className={`nav-link ${tabName === name ? "active" : ""}`}
        onClick={handleClick}
      >
        {icon && <i className="ion-pound"></i>} {text}
      </button>
    </li>
  );
}

export default FeedNavLink;
