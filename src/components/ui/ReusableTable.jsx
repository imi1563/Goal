import React, { useMemo, memo } from "react";
import PropTypes from 'prop-types';

/**
 * @typedef {Object} Column
 * @property {string} key - Unique identifier for the column
 * @property {string} label - Display label for the column header
 * @property {string} [width] - Width of the column (e.g., '100px', '20%')
 * @property {string} [align] - Text alignment ('left', 'center', 'right')
 * @property {function} [render] - Custom render function for the cell
 */

/**
 * Reusable data table with pagination and sorting support
 * @param {Object} props
 * @param {Column[]} props.columns - Array of column definitions
 * @param {Array<Object>} props.data - Array of data objects
 * @param {number} [props.itemsPerPage=10] - Number of items per page
 * @param {number} [props.currentPage=1] - Current page number (1-based)
 * @param {number} [props.totalItems=0] - Total number of items
 * @param {function} [props.onPageChange] - Callback when page changes
 * @param {string} [props.emptyMessage='No data available'] - Message to display when data is empty
 */
const ReusableTable = memo(({
  columns = [],
  data = [],
  totalPages = 1,
  currentPage = 1,
  totalItems = 0,
  onPageChange,
  emptyMessage = 'No data available'
}) => {
  // For client-side pagination, we'll use the full data array
  // For server-side pagination, we'll use the data as is
  const displayData = useMemo(() => {
    return data;
  }, [data]);

  const alignClass = (col) => {
    const key = (col.key || "").toString().toLowerCase();
    const label = (col.label || "").toString().toLowerCase();
    const isAction = key === "action" || key === "actions" || label.includes("action");
    if (isAction) return "text-left";
    if (col.align === "right") return "text-right";
    if (col.align === "center") return "text-center";
    return "text-left";
  };

  const cellSizeClass = (col) => {
    const key = (col.key || "").toString().toLowerCase();
    const label = (col.label || "").toString().toLowerCase();
    const isAction = key === "action" || key === "actions" || label.includes("action");
    return isAction ? "text-xl" : "";
  };

  const hasFixedWidths = columns.some((c) => Boolean(c.width));
  const getWidthStyle = (col) => {
    if (!col.width) return undefined;
    const width = typeof col.width === "number" ? `${col.width}px` : col.width;
    return { width };
  };

  // Memoize pagination component
  const pagination = useMemo(() => {
    if (!onPageChange || totalPages <= 1) return null;

    const getPageNumbers = () => {
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
    };

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#2c2752] gap-4">
        <div className="text-sm text-white/60">
          {/* Showing {displayData.length} of {totalItems} items (Page {currentPage} of {totalPages}) */}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#4F3DED]/20"
            aria-label="First page"
          >
            «
          </button>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#4F3DED]/20"
            aria-label="Previous page"
          >
            ‹
          </button>

          <div className="flex gap-1 mx-1">
            {getPageNumbers().map((pageNum, index) => (
              <button
                key={pageNum === '...' ? `ellipsis-${index}` : pageNum}
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
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#4F3DED]/20"
            aria-label="Next page"
          >
            ›
          </button>
          <button
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
  }, [currentPage, displayData.length, onPageChange, totalPages, totalItems]);

  return (
    <div className="w-full overflow-hidden border border-[#2c2752] bg-[#1f1a3e] rounded-lg">
      <div className="overflow-x-auto">
        <table
          className={`min-w-full text-left ${hasFixedWidths ? 'table-fixed' : 'w-full'}`}
          aria-label="League management table"
        >
          {hasFixedWidths && (
            <colgroup>
              {columns.map((col) => (
                <col
                  key={`col-${col.key}`}
                  style={getWidthStyle(col)}
                  aria-label={col.label}
                />
              ))}
            </colgroup>
          )}
          <thead>
            <tr className="bg-[#323159] text-white text-sm">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-6 py-4 font-medium ${alignClass(col)}`}
                  style={getWidthStyle(col)}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-white/60"
                  aria-live="polite"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayData.map((row, idx) => (
                <tr
                  key={row.id || `row-${idx}`}
                  className={`text-sm text-white/80 transition-colors ${idx % 2 === 0 ? 'bg-[#282353]' : 'bg-[#323159]'
                    } hover:bg-opacity-80`}
                >
                  {columns.map((col) => (
                    <td
                      key={`${row.id || 'row'}-${col.key}`}
                      className={`px-6 py-4 ${alignClass(col)} ${cellSizeClass(col)}`}
                      style={getWidthStyle(col)}
                    >
                      {col.render ? (
                        <div className="truncate">
                          {col.render(row[col.key], row, idx)}
                        </div>
                      ) : (
                        <div className="truncate">
                          {row[col.key] ?? '-'}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination}
    </div>
  );
});

ReusableTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  emptyMessage: PropTypes.string,
};

ReusableTable.defaultProps = {
  itemsPerPage: 10,
  currentPage: 1,
  emptyMessage: 'No data available',
};

export default ReusableTable;
