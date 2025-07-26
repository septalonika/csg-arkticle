// Global variables to store all posts data and pagination state
let allPosts = [];
let allRerumPosts = [];
let currentRerumPage = 1;
const rerumItemsPerPage = 3; // Display 3 rerum posts per page

// Function to count posts with "rerum" in body
function countPostsWithRerum(posts) {
  return posts.filter((post) => post.body.toLowerCase().includes("rerum"));
}

// Function to count posts by user
function countPostsByUser(posts) {
  const userCounts = {};
  posts.forEach((post) => {
    userCounts[post.userId] = (userCounts[post.userId] || 0) + 1;
  });

  // Convert to array and sort by user ID
  return Object.entries(userCounts)
    .map(([userId, count]) => ({ userId: parseInt(userId), count }))
    .sort((a, b) => a.userId - b.userId);
}

// Function to render user posts table
function renderUserPostsTable(userPostCounts) {
  const tbody = document.getElementById("user-posts-tbody");
  tbody.innerHTML = "";

  userPostCounts.forEach((user, index) => {
    const tr = document.createElement("tr");
    tr.className = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-blue-300 transition duration-150 ease-in-out`;

    // User ID cell
    const userIdTd = document.createElement("td");
    userIdTd.className = "px-4 py-2 text-sm text-center text-gray-800";
    userIdTd.textContent = user.userId;
    tr.appendChild(userIdTd);

    // Post Count cell
    const countTd = document.createElement("td");
    countTd.className =
      "px-4 py-2 text-sm font-semibold text-center text-gray-800";
    countTd.textContent = user.count;
    tr.appendChild(countTd);

    tbody.appendChild(tr);
  });
}

// Function to create pagination button for rerum posts
function createRerumPaginationButton(text, isActive, isDisabled, onClick) {
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

// Function to update pagination controls for rerum posts
function updateRerumPaginationControls() {
  const paginationContainer = document.getElementById(
    "rerum-pagination-controls",
  );
  if (!paginationContainer) return;

  paginationContainer.innerHTML = ""; // Clear existing controls

  const totalPages = Math.ceil(allRerumPosts.length / rerumItemsPerPage);
  if (totalPages <= 1) {
    // No pagination needed if only one page or less
    return;
  }

  // Previous button
  paginationContainer.appendChild(
    createRerumPaginationButton("<", false, currentRerumPage === 1, () => {
      if (currentRerumPage > 1) {
        currentRerumPage--;
        renderRerumPostsDetails();
      }
    }),
  );

  const pagesToDisplay = new Set();
  const maxButtons = 5;
  const numAdjacent = Math.floor((maxButtons - 3) / 2);

  // Always add the first page
  pagesToDisplay.add(1);

  // Add pages around the current page
  for (
    let i = currentRerumPage - numAdjacent;
    i <= currentRerumPage + numAdjacent;
    i++
  ) {
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
      createRerumPaginationButton(
        page,
        currentRerumPage === page,
        false,
        () => {
          currentRerumPage = page;
          renderRerumPostsDetails();
        },
      ),
    );
    lastPageRendered = page;
  });

  // Next button
  paginationContainer.appendChild(
    createRerumPaginationButton(
      ">",
      false,
      currentRerumPage === totalPages,
      () => {
        if (currentRerumPage < totalPages) {
          currentRerumPage++;
          renderRerumPostsDetails();
        }
      },
    ),
  );
}

// Function to render rerum posts details with pagination
function renderRerumPostsDetails() {
  const tbody = document.getElementById("rerum-posts-tbody");
  tbody.innerHTML = "";

  // Calculate pagination
  const startIndex = (currentRerumPage - 1) * rerumItemsPerPage;
  const endIndex = startIndex + rerumItemsPerPage;
  const paginatedPosts = allRerumPosts.slice(startIndex, endIndex);

  paginatedPosts.forEach((post, index) => {
    const tr = document.createElement("tr");
    tr.className = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-blue-300 transition duration-150 ease-in-out`;

    // User ID cell
    const userIdTd = document.createElement("td");
    userIdTd.className = "px-4 py-2 text-sm text-center text-gray-800";
    userIdTd.textContent = post.userId;
    tr.appendChild(userIdTd);

    // Title cell
    const titleTd = document.createElement("td");
    titleTd.className =
      "px-4 py-2 text-sm text-center text-gray-800 table-cell-content";
    titleTd.textContent = post.title;
    tr.appendChild(titleTd);

    // Body preview cell (first 100 characters)
    const bodyTd = document.createElement("td");
    bodyTd.className =
      "px-4 py-2 text-sm text-center text-gray-600 table-cell-content";
    const bodyPreview =
      post.body.length > 100 ? post.body.substring(0, 100) + "..." : post.body;
    bodyTd.textContent = bodyPreview;
    tr.appendChild(bodyTd);

    tbody.appendChild(tr);
  });

  // Update pagination controls
  updateRerumPaginationControls();
}

// Function to show/hide rerum details
function toggleRerumDetails() {
  const detailsDiv = document.getElementById("rerum-details");
  const toggleButton = document.getElementById("toggle-rerum-details");

  if (detailsDiv.classList.contains("hidden")) {
    detailsDiv.classList.remove("hidden");
    toggleButton.textContent = "Hide Details";
    // Render the details when showing for the first time
    if (allRerumPosts.length > 0) {
      renderRerumPostsDetails();
    }
  } else {
    detailsDiv.classList.add("hidden");
    toggleButton.textContent = "Show Details";
  }
}

// Main function to load and display reports
async function loadReports() {
  const loadingState = document.getElementById("loading-state");
  const reportsContainer = document.getElementById("reports-container");
  const errorState = document.getElementById("error-state");

  try {
    // Show loading state
    loadingState.style.display = "block";
    reportsContainer.style.display = "none";
    errorState.style.display = "none";

    // Fetch data from API
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    allPosts = await response.json();

    // Generate reports
    allRerumPosts = countPostsWithRerum(allPosts);
    const userPostCounts = countPostsByUser(allPosts);

    // Update Report 1: Rerum count
    document.getElementById("rerum-count").textContent = allRerumPosts.length;

    // Reset pagination for rerum posts
    currentRerumPage = 1;

    // Update Report 2: User post counts
    renderUserPostsTable(userPostCounts);

    // Show reports container
    loadingState.style.display = "none";
    reportsContainer.style.display = "block";
  } catch (error) {
    console.error("Error loading reports:", error);
    loadingState.style.display = "none";
    errorState.style.display = "block";
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadReports();

  // Add event listener for toggle button
  document
    .getElementById("toggle-rerum-details")
    .addEventListener("click", toggleRerumDetails);
});
