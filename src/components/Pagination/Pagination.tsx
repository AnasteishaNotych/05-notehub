import css from "./Pagination.module.css";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
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
