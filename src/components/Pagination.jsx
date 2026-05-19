import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Pagination({ page, totalCount, setPage }) {
  const totalPages = Math.ceil(totalCount / 25);

  if (totalCount <= 25) return null;

  return (
    <div className="mt-5 d-flex justify-content-center align-items-center gap-3">
      <button 
        className="btn btn-outline-primary px-4 shadow-sm d-flex align-items-center gap-2" 
        disabled={page === 1} 
        onClick={() => setPage(page - 1)}
      >
        <i className="bi bi-arrow-left-circle"></i> Previous
      </button>
      <div className="fw-bold">
        Page <span className="text-primary">{page}</span> of {totalPages}
      </div>
      <button 
        className="btn btn-outline-primary px-4 shadow-sm d-flex align-items-center gap-2" 
        disabled={page >= totalPages} 
        onClick={() => setPage(page + 1)}
      >
        Next <i className="bi bi-arrow-right-circle"></i>
      </button>
    </div>
  );
}
