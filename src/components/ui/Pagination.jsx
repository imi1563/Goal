import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    showPageInfo = true,
    className = ''
}) => {
    const paginationItems = useMemo(() => {
        if (totalPages <= 1) return [];

        const maxVisiblePages = 5;
        const pages = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of the middle section
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the start or end
            if (currentPage <= 3) {
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            // Add ellipsis if needed
            if (startPage > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                if (i > 1 && i < totalPages) {
                    pages.push(i);
                }
            }

            // Add ellipsis if needed
            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#2c2752] gap-4 ${className}`}>
            {/* {showPageInfo && (
                <div className="text-sm text-white/60">
                    Showing {startItem}-{endItem} of {totalItems} items
                </div>
            )} */}
            <div className=""></div>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#4F3DED]/20"
                    aria-label="First page"
                >
                    «
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#4F3DED]/20"
                    aria-label="Previous page"
                >
                    ‹
                </button>

                <div className="flex gap-1 mx-1">
                    {paginationItems.map((pageNum, index) => (
                        <button
                            key={pageNum === '...' ? `ellipsis-${index}` : pageNum}
                            type="button"
                            onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                            disabled={pageNum === '...'}
                            className={`min-w-10 h-10 rounded-lg text-sm font-medium transition-colors ${pageNum === currentPage
                                ? 'bg-[#4F3DED] text-white'
                                : 'text-[#AEB9E1] hover:bg-[#323159] hover:text-white'
                                } ${pageNum === '...' ? 'cursor-default' : ''}`}
                            aria-current={pageNum === currentPage ? 'page' : undefined}
                            aria-label={pageNum === '...' ? 'Ellipsis' : `Page ${pageNum}`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#4F3DED]/20"
                    aria-label="Next page"
                >
                    ›
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#4F3DED]/20"
                    aria-label="Last page"
                >
                    »
                </button>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    showPageInfo: PropTypes.bool,
    className: PropTypes.string
};

export default Pagination;
