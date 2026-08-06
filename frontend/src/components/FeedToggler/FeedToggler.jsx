import { useAuth } from "../../context/AuthContext";
import { useFeedContext } from "../../context/FeedContext";
import FeedNavLink from "./FeedNavLink";

function FeedToggler() {
  const { isAuth } = useAuth();
  const { tabName, tagName, clearTagFilter } = useFeedContext();

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {isAuth && <FeedNavLink name="feed" text="Your Feed" />}

        <FeedNavLink name="global" text="Global Feed" />

        {tabName === "tag" && (
          <>
            <FeedNavLink icon name="tag" text={tagName} />
            <li className="nav-item">
              <button
                type="button"
                className="nav-link"
                onClick={clearTagFilter}
                aria-label="Clear tag filter"
              >
                <i className="ion-close-round"></i>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default FeedToggler;
