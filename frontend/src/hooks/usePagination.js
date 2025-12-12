import { useState } from 'react';

export const usePagination = (items, itemsPerPage = 6) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);
  const paginatedItems = items?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};