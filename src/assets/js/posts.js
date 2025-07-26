// Global variables for pagination state
let currentPage = 1;
const itemsPerPage = 5; // Display 5 items per page
let allTableData = []; // To store all original data
let filteredTableData = []; // To store data after applying search filter

function createTable(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  // Clear existing content in the container
  container.innerHTML = "";

  // If no data, display a message
  if (!data || data.length === 0) {
    container.innerHTML =
      '<p class="py-8 text-center text-gray-600">No data available to display.</p>';
    return;
  }

  // Create table element
  const table = document.createElement("table");
  // Apply Tailwind classes for styling the table and custom class for fixed layout
  table.className =
    "min-w-full overflow-hidden border-collapse rounded-lg table-fixed-layout";

  // Create table header (thead)
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.className = "bg-blue-500"; // Header row background

  // Get headers from the keys of the first data object, excluding 'id'
  const headers = Object.keys(data[0]).filter((key) => key !== "id");

  // Define column widths for better control with table-layout: fixed
  const columnWidths = {
    userId: "w-2/12",
    title: "w-4/12",
    body: "w-6/12",
  };

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    // Apply width classes and other styling
    th.className = `px-4 py-4 text-sm font-semibold text-center text-white uppercase tracking-wider ${columnWidths[headerText] || ""}`;

    // Customize header text for 'userId', 'title', 'body'
    let displayHeaderText = headerText;
    if (headerText === "userId") {
      displayHeaderText = "ID";
    } else if (headerText === "title") {
      displayHeaderText = "Title";
    } else if (headerText === "body") {
      displayHeaderText = "Body";
    } else {
      // Convert camelCase to readable text (e.g., userId -> User Id) for other headers
      displayHeaderText = headerText.replace(/([A-Z])/g, " $1").trim();
    }
    th.textContent = displayHeaderText;
    headerRow.appendChild(th); // Append th to headerRow
  });
  thead.appendChild(headerRow); // Append headerRow to thead
  table.appendChild(thead); // Append thead to table

  // Create table body (tbody)
  const tbody = document.createElement("tbody");

  // Populate table rows
  data.forEach((rowData, index) => {
    const tr = document.createElement("tr");
    tr.className = `drop-shadow-lg drop-shadow-white ${rowData.body.toLowerCase().includes("rerum") ? "bg-sky-200" : index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-blue-300 transition duration-150 ease-in-out`;

    // Iterate over filtered headers to create cells
    headers.forEach((key) => {
      const td = document.createElement("td");
      td.className = `px-4 py-2 text-sm text-gray-800 last:border-r-0 table-cell-content text-center`;
      td.textContent = rowData[key];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

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
  updatePaginationControls(dataToRender.length); // Pass the total count of data being rendered
}
function createPaginationButton(text, isActive, isDisabled, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = `px-4 py-2 rounded-md transition duration-150 ${
    isActive
      ? "bg-blue-600 text-white"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
  } ${isDisabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : ""}`;
  button.disabled = isDisabled;
  if (onClick) {
    button.addEventListener("click", onClick);
  }
  return button;
}

function updatePaginationControls(totalDataCount) {
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
        currentPage--;
        renderTableAndPagination();
      }
    }),
  );

  const pagesToDisplay = new Set();
  const maxButtons = 5;
  const numAdjacent = Math.floor((maxButtons - 3) / 2);

  // Always add the first page
  pagesToDisplay.add(1);

  // Add pages around the current page
  for (let i = currentPage - numAdjacent; i <= currentPage + numAdjacent; i++) {
    if (i > 0 && i <= totalPages) {
      pagesToDisplay.add(i);
    }
  }

  // Always add the last page
  pagesToDisplay.add(totalPages);

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
        currentPage = page;
        renderTableAndPagination();
      }),
    );
    lastPageRendered = page;
  });

  // Next button
  paginationContainer.appendChild(
    createPaginationButton(">", false, currentPage === totalPages, () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTableAndPagination();
      }
    }),
  );
}

// filter function
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

    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allTableData = await response.json();
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
