import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  const Paginate = (ReactPaginate as any).default
    ? (ReactPaginate as any).default
    : ReactPaginate;
  return (
    <Paginate
      containerClassName={css.pagination}
      activeClassName={css.active}
      onPageChange={onPageChange}
      pageCount={pageCount}
      forcePage={forcePage - 1}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
    />
  );
}

export default Pagination;
