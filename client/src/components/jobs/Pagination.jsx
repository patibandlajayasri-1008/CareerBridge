import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#E4E8F0] mt-8 text-xs text-[#667085]">
      <div>
        Showing <strong className="text-[#172033]">{startItem}</strong> to{' '}
        <strong className="text-[#172033]">{endItem}</strong> of{' '}
        <strong className="text-[#172033]">{totalItems}</strong> openings
      </div>

      <nav className="inline-flex items-center gap-1.5" aria-label="Pagination">
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-lg border border-[#E4E8F0] bg-white text-[#172033] hover:bg-[#F6F8FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-8 h-8 px-2.5 rounded-lg text-xs font-semibold transition-all ${
              currentPage === page
                ? 'bg-[#3157D5] text-white shadow-2xs'
                : 'border border-[#E4E8F0] bg-white text-[#172033] hover:bg-[#F6F8FC]'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg border border-[#E4E8F0] bg-white text-[#172033] hover:bg-[#F6F8FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
