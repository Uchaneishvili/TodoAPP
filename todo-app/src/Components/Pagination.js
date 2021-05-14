import React from "react";

function Pagination() {
  return (
    <div className="pagination-container">
      <button className="btn btn-outline-light pagination-buttons">
        {"<"}
      </button>
      <button className="btn btn-outline-light pagination-buttons">1</button>
      <button className="btn btn-outline-light pagination-buttons">
        {">"}
      </button>
    </div>
  );
}

export default Pagination;
