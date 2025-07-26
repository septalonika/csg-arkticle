import { renderRerumPostsDetailsTable, createPaginationButton } from "./dom.js";

export const rerumItemsPerPage = 3; // Display 3 rerum posts per page
let currentRerumPage = 1;

export function countPostsWithRerum(posts) {
  return posts.filter((post) => post.body.toLowerCase().includes("rerum"));
}

export function countPostsByUser(posts) {
  const userCounts = {};
  posts.forEach((post) => {
    userCounts[post.userId] = (userCounts[post.userId] || 0) + 1;
  });

  return Object.entries(userCounts)
    .map(([userId, count]) => ({ userId: parseInt(userId), count }))
    .sort((a, b) => a.userId - b.userId);
}

export function setRerumCurrentPage(page) {
  currentRerumPage = page;
}

export function getRerumCurrentPage() {
  return currentRerumPage;
}

export function renderRerumPostsDetails(allRerumPosts, onPageChangeCallback) {
  const startIndex = (currentRerumPage - 1) * rerumItemsPerPage;
  const endIndex = startIndex + rerumItemsPerPage;
  const paginatedPosts = allRerumPosts.slice(startIndex, endIndex);

  renderRerumPostsDetailsTable(paginatedPosts);
  updateRerumPaginationControls(allRerumPosts.length, onPageChangeCallback);
}

export function updateRerumPaginationControls(
  totalRerumPostsCount,
  onPageChangeCallback,
) {
  const paginationContainer = document.getElementById(
    "rerum-pagination-controls",
  );
  if (!paginationContainer) {
    console.error("Rerum pagination controls container not found.");
    return;
  }
  paginationContainer.innerHTML = ""; // Clear existing controls

  const totalPages = Math.ceil(totalRerumPostsCount / rerumItemsPerPage);
  if (totalPages <= 1) {
    return;
  }

  // Previous button
  paginationContainer.appendChild(
    createPaginationButton("<", false, currentRerumPage === 1, () => {
      if (currentRerumPage > 1) {
        setRerumCurrentPage(currentRerumPage - 1);
        onPageChangeCallback();
      }
    }),
  );

  const pagesToDisplay = new Set();
  const maxButtons = 5;
  const numAdjacent = Math.floor((maxButtons - 3) / 2);

  pagesToDisplay.add(1);

  for (
    let i = currentRerumPage - numAdjacent;
    i <= currentRerumPage + numAdjacent;
    i++
  ) {
    if (i > 0 && i <= totalPages) {
      pagesToDisplay.add(i);
    }
  }

  pagesToDisplay.add(totalPages);

  const sortedPages = Array.from(pagesToDisplay).sort((a, b) => a - b);

  let lastPageRendered = 0;
  sortedPages.forEach((page) => {
    if (page - lastPageRendered > 1) {
      const ellipsisSpan = document.createElement("span");
      ellipsisSpan.textContent = "...";
      ellipsisSpan.className = "px-2 py-2 text-gray-600";
      paginationContainer.appendChild(ellipsisSpan);
    }
    paginationContainer.appendChild(
      createPaginationButton(page, currentRerumPage === page, false, () => {
        setRerumCurrentPage(page);
        onPageChangeCallback();
      }),
    );
    lastPageRendered = page;
  });

  // Next button
  paginationContainer.appendChild(
    createPaginationButton(">", false, currentRerumPage === totalPages, () => {
      if (currentRerumPage < totalPages) {
        setRerumCurrentPage(currentRerumPage + 1);
        onPageChangeCallback();
      }
    }),
  );
}
