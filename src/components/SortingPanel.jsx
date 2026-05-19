import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function SortingPanel({ sortBy, isDesc, toggleSort }) {
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;

    return (
      <i
        className={`bi ${
          isDesc ? 'bi-sort-down-alt' : 'bi-sort-up-alt'
        }`}
      ></i>
    );
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <div className="d-flex gap-3">
        <button
          className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 flex-fill ${
            sortBy === 'username'
              ? 'btn-dark'
              : 'btn btn-outline-secondary'
          }`}
          onClick={() => toggleSort('username')}
        >
          <i className="bi bi-person-fill"></i>
          Sort by Name
          {getSortIcon('username')}
        </button>

        <button
          className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 flex-fill ${
            sortBy === 'email'
              ? 'btn-dark'
              : 'btn btn-outline-secondary'
          }`}
          onClick={() => toggleSort('email')}
        >
          <i className="bi bi-envelope-fill"></i>
          Sort by Email
          {getSortIcon('email')}
        </button>

        <button
          className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 flex-fill ${
            sortBy === 'date'
              ? 'btn-dark'
              : 'btn btn-outline-secondary'
          }`}
          onClick={() => toggleSort('date')}
        >
          <i className="bi bi-calendar-date-fill"></i>
          Sort by Date
          {getSortIcon('date')}
        </button>
      </div>
    </div>
  );
}