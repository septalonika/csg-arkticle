export function renderUserPostsTable(userPostCounts) {
  const tbody = document.getElementById("user-posts-tbody");
  if (!tbody) {
    console.error("User posts tbody not found.");
    return;
  }
  tbody.innerHTML = "";

  userPostCounts.forEach((user, index) => {
    const tr = document.createElement("tr");
    tr.className = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-blue-300 transition duration-150 ease-in-out`;

    const userIdTd = document.createElement("td");
    userIdTd.className = "px-4 py-2 text-sm text-center text-gray-800";
    userIdTd.textContent = user.userId;
    tr.appendChild(userIdTd);

    const countTd = document.createElement("td");
    countTd.className =
      "px-4 py-2 text-sm font-semibold text-center text-gray-800";
    countTd.textContent = user.count;
    tr.appendChild(countTd);

    tbody.appendChild(tr);
  });
}
export function renderRerumPostsDetailsTable(paginatedPosts) {
  const tbody = document.getElementById("rerum-posts-tbody");
  if (!tbody) {
    console.error("Rerum posts tbody not found.");
    return;
  }
  tbody.innerHTML = "";

  if (paginatedPosts.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3" class="py-4 text-center text-gray-600">No "rerum" posts to display for this page.</td>`;
    tbody.appendChild(tr);
    return;
  }

  paginatedPosts.forEach((post, index) => {
    const tr = document.createElement("tr");
    tr.className = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-blue-300 transition duration-150 ease-in-out`;

    const userIdTd = document.createElement("td");
    userIdTd.className = "px-4 py-2 text-sm text-center text-gray-800";
    userIdTd.textContent = post.userId;
    tr.appendChild(userIdTd);

    const titleTd = document.createElement("td");
    titleTd.className =
      "px-4 py-2 text-sm text-center text-gray-800 table-cell-content";
    titleTd.textContent = post.title;
    tr.appendChild(titleTd);

    const bodyTd = document.createElement("td");
    bodyTd.className =
      "px-4 py-2 text-sm text-center text-gray-600 table-cell-content";
    const bodyPreview =
      post.body.length > 100 ? post.body.substring(0, 100) + "..." : post.body;
    bodyTd.textContent = bodyPreview;
    tr.appendChild(bodyTd);

    tbody.appendChild(tr);
  });
}

export function createPaginationButton(text, isActive, isDisabled, onClick) {
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
