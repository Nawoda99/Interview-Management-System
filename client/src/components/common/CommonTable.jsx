import React, { useEffect, useState } from "react";

const CommonTable = ({
  columns = [],
  data = [],
  inMobileCard = false,
  pageSize = 5,
  searchKey = "",
}) => {
  const [filterText, setFilterText] = useState(searchKey);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    setFilterText(searchKey || "");
    setCurrentPage(1);
  }, [searchKey]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderPagination = () => {
    const pageNumbers = [];
    const visiblePages = 5;
    const halfVisible = Math.floor(visiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    if (startPage > 1) pageNumbers.push("prev");
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages) pageNumbers.push("next");

    return (
      <div className="flex flex-wrap justify-center gap-2 my-4">
        {pageNumbers.map((page, index) =>
          page === "prev" ? (
            <button
              key="prev"
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border border-amber-200 rounded-md hover:bg-amber-50"
            >
              &laquo;
            </button>
          ) : page === "next" ? (
            <button
              key="next"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border border-amber-200 rounded-md hover:bg-amber-50"
            >
              &raquo;
            </button>
          ) : (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium border ${
                currentPage === page
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <div className="w-full overflow-auto bg-white rounded-lg shadow">
      {(!inMobileCard || !isMobile) && (
        <div className="block">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-white bg-amber-600">
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`px-4 py-3 whitespace-nowrap ${
                        idx === 0 ? "rounded-tl-lg" : ""
                      } ${idx === columns.length - 1 ? "rounded-tr-lg" : ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-4 text-center text-amber-400"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-amber-100 hover:bg-amber-50"
                    >
                      {columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-2 whitespace-nowrap"
                        >
                          {typeof col.render === "function"
                            ? col.render(row[col.accessor], row)
                            : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      )}

      {inMobileCard && isMobile && (
        <div className="block p-4 space-y-4">
          {paginatedData.length === 0 ? (
            <div className="text-center text-amber-400">No records found.</div>
          ) : (
            paginatedData.map((row, index) => (
              <div
                key={index}
                className="p-4 border border-amber-300 shadow-md rounded-xl bg-gradient-to-br from-white to-amber-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-amber-700">
                    {row.name} — {row.date}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      row.status === "Present"
                        ? "bg-green-100 text-green-600"
                        : row.status === "Absent"
                        ? "bg-red-100 text-red-600"
                        : row.status === "On Leave"
                        ? "bg-yellow-100 text-yellow-600"
                        : row.status === "Late"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-sm gap-x-4 gap-y-2">
                  {columns.map(
                    (col, colIndex) =>
                      col.accessor !== "name" &&
                      col.accessor !== "date" &&
                      col.accessor !== "status" && (
                        <div key={colIndex}>
                          <div className="text-xs font-medium text-amber-500">
                            {col.label}
                          </div>
                          <div className="text-amber-800">
                            {typeof col.render === "function"
                              ? col.render(row[col.accessor], row)
                              : row[col.accessor]}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))
          )}
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default CommonTable;
