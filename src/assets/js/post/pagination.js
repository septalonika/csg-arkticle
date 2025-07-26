import { createPaginationButton } from "./dom.js";
export function updatePaginationControls(
  totalDataCount,
  currentPage,
  itemsPerPage,
  onPageChange,
) {
  const paginationContainer = document.getElementById("pagination-controls");
  if (!paginationContainer) {
    console.error("Pagination controls container not found.");
    return;
  }
  paginationContainer.innerHTML = ""; // Clear existing controls

  const totalPages = Math.ceil(totalDataCount / itemsPerPage);
  if (totalPages <= 1) {
    // No pagination needed if only one page or less
    return;
  }

  // Previous button
  paginationContainer.appendChild(
    createPaginationButton("<", false, currentPage === 1, () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }),
  );

  const pagesToDisplay = new Set();
  const maxButtons = 5;
  const numAdjacent = Math.floor((maxButtons - 3) / 2);

  pagesToDisplay.add(1); // Always add the first page

  // Add pages around the current page
  for (let i = currentPage - numAdjacent; i <= currentPage + numAdjacent; i++) {
    if (i > 0 && i <= totalPages) {
      pagesToDisplay.add(i);
    }
  }

  pagesToDisplay.add(totalPages); // Always add the last page

  // Convert set to array, sort
  const sortedPages = Array.from(pagesToDisplay).sort((a, b) => a - b);

  // Render buttons and ellipses
  let lastPageRendered = 0;
  sortedPages.forEach((page) => {
    if (page - lastPageRendered > 1) {
      const ellipsisSpan = document.createElement("span");
      ellipsisSpan.textContent = "...";
      ellipsisSpan.className = "px-2 py-2 text-gray-600";
      paginationContainer.appendChild(ellipsisSpan);
    }
    paginationContainer.appendChild(
      createPaginationButton(page, currentPage === page, false, () => {
        onPageChange(page);
      }),
    );
    lastPageRendered = page;
  });

  // Next button
  paginationContainer.appendChild(
    createPaginationButton(">", false, currentPage === totalPages, () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }),
  );
}
