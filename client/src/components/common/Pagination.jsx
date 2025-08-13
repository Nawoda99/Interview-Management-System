const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showInfo = false,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {showInfo && (
        <div className="text-sm text-amber-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </div>
      )}
      <div className="flex gap-2">
        <button
          className="border px-3 py-1 rounded disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`w-8 h-8 p-0 rounded ${
              currentPage === page ? "bg-amber-600 text-white" : "border"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="border px-3 py-1 rounded disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
