import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const ResolvedPaginate = ((
  ReactPaginate as unknown as {
    default?: React.ComponentType<ReactPaginateProps>;
  }
).default || ReactPaginate) as React.ComponentType<ReactPaginateProps>;

function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  return (
    <ResolvedPaginate
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
