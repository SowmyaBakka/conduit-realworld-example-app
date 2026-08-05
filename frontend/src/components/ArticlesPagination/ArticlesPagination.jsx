import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import { useFeedContext } from "../../context/FeedContext";
import { toSearchParams } from "../../helpers/homeFeedQuery";

function ArticlesPagination({
  articlesCount,
  location,
  tagName,
  updateArticles,
  username,
}) {
  const totalPages = Math.ceil(articlesCount / 3);
  const [, setSearchParams] = useSearchParams();
  const { tabName, tagName: contextTagName, pageIndex } = useFeedContext();

  const handlePageChange = ({ selected }) => {
    setSearchParams(
      toSearchParams({
        tabName,
        tagName: contextTagName,
        pageIndex: selected,
      })
    );
  };

  return (
    <ReactPaginate
      activeClassName="active"
      breakClassName="page-item"
      breakLabel="..."
      breakLinkClassName="page-link"
      containerClassName="pagination pagination-sm"
      forcePage={pageIndex}
      nextClassName="page-item"
      nextLabel={<i className="ion-arrow-right-b"></i>}
      nextLinkClassName="page-link"
      onPageChange={handlePageChange}
      pageClassName="page-item"
      pageCount={totalPages}
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLabel={<i className="ion-arrow-left-b"></i>}
      previousLinkClassName="page-link"
      renderOnZeroPageCount={null}
    />
  );
}

export default ArticlesPagination;
