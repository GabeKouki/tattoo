import React from "react";
import "./Pagination.css";

const Pagination = ({
  totalPosts,
  itemsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / itemsPerPage); i++) {
    pages.push(i);
  }

  return (
    <>
      {pages.map((page, index) => (
        <button
          key={index}
          className={`PaginationButton ${page === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </>
  );
};

export default Pagination;
