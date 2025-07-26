import { fetchPosts } from "./api.js";
import { createTable } from "./dom.js";
import { updatePaginationControls } from "./pagination.js";

// Global variables for pagination and data state
let currentPage = 1;
const itemsPerPage = 5; // Display 5 items per page
let allTableData = []; // To store all original data
let filteredTableData = []; // To store data after applying search filter

function renderTableAndPagination() {
  const dataToRender =
    filteredTableData.length > 0 ||
    document.getElementById("search").value !== ""
      ? filteredTableData
      : allTableData;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dataToRender.slice(startIndex, endIndex);

  createTable(paginatedData, "table-container");
  updatePaginationControls(
    dataToRender.length,
    currentPage,
    itemsPerPage,
    (newPage) => {
      currentPage = newPage;
      renderTableAndPagination();
    },
  );
}

/**
 * Filters the table data based on the search term and re-renders the table.
 */
function filterTableData() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  if (searchTerm === "") {
    filteredTableData = allTableData; // If search term is empty, show all data
  } else {
    filteredTableData = allTableData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.body.toLowerCase().includes(searchTerm),
    );
  }
  currentPage = 1; // Reset to first page on new search
  renderTableAndPagination();
}

// --- Data Fetching and Initial Render ---
document.addEventListener("DOMContentLoaded", async () => {
  const tableContainer = document.getElementById("table-container");
  const searchInput = document.getElementById("search");

  try {
    // Display loading message
    tableContainer.innerHTML =
      '<p class="py-8 text-center text-gray-600">Loading data from API...</p>';

    allTableData = await fetchPosts();
    filteredTableData = allTableData; // Initially, filtered data is all data

    renderTableAndPagination(); // Render table with fetched data

    // Add event listener for search input
    searchInput.addEventListener("input", filterTableData);
  } catch (error) {
    console.error("Error fetching data:", error);
    tableContainer.innerHTML = `<p class="py-8 text-center text-red-600">Failed to load data: ${error.message}. Please try again later.</p>`;
    const paginationControls = document.getElementById("pagination-controls");
    if (paginationControls) {
      paginationControls.innerHTML = ""; // Clear pagination controls on error
    }
  }
});
