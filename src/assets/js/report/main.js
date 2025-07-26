import { fetchPosts } from "./api.js";
import { renderUserPostsTable } from "./dom.js";
import {
  countPostsWithRerum,
  countPostsByUser,
  renderRerumPostsDetails,
  setRerumCurrentPage,
  getRerumCurrentPage,
  rerumItemsPerPage,
} from "./reports.js";

// Global variables for data state
let allPosts = [];
let allRerumPosts = [];

function toggleRerumDetails() {
  const detailsDiv = document.getElementById("rerum-details");
  const toggleButton = document.getElementById("toggle-rerum-details");

  if (detailsDiv.classList.contains("hidden")) {
    detailsDiv.classList.remove("hidden");
    toggleButton.textContent = "Hide Details";
    // Render the details when showing for the first time
    // or when navigating back after hiding
    if (allRerumPosts.length > 0) {
      renderRerumPostsDetails(allRerumPosts, () =>
        renderRerumPostsDetails(allRerumPosts, this),
      );
    }
  } else {
    detailsDiv.classList.add("hidden");
    toggleButton.textContent = "Show Details";
  }
}

/**
 * Main function to load and display all reports.
 */
async function loadReports() {
  const loadingState = document.getElementById("loading-state");
  const reportsContainer = document.getElementById("reports-container");
  const errorState = document.getElementById("error-state");

  try {
    // Show loading state and hide others
    if (loadingState) loadingState.style.display = "block";
    if (reportsContainer) reportsContainer.style.display = "none";
    if (errorState) errorState.style.display = "none";

    allPosts = await fetchPosts();

    // Generate reports
    allRerumPosts = countPostsWithRerum(allPosts);
    const userPostCounts = countPostsByUser(allPosts);

    // Update Report 1: Rerum count
    const rerumCountElement = document.getElementById("rerum-count");
    if (rerumCountElement) {
      rerumCountElement.textContent = allRerumPosts.length;
    }

    // Reset pagination for rerum posts
    setRerumCurrentPage(1);

    // Update Report 2: User post counts
    renderUserPostsTable(userPostCounts);

    // Show reports container
    if (loadingState) loadingState.style.display = "none";
    if (reportsContainer) reportsContainer.style.display = "block";
  } catch (error) {
    console.error("Error loading reports:", error);
    if (loadingState) loadingState.style.display = "none";
    if (errorState) errorState.style.display = "block";
    // Clear any potentially visible pagination controls on error
    const paginationControls = document.getElementById(
      "rerum-pagination-controls",
    );
    if (paginationControls) {
      paginationControls.innerHTML = "";
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadReports();

  // Add event listener for toggle button
  const toggleButton = document.getElementById("toggle-rerum-details");
  if (toggleButton) {
    toggleButton.addEventListener("click", toggleRerumDetails);
  }
});
