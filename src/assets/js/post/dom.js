export function createTable(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  container.innerHTML = ""; // Clear existing content

  if (!data || data.length === 0) {
    container.innerHTML =
      '<p class="py-8 text-center text-gray-600">No data available to display.</p>';
    return;
  }

  const table = document.createElement("table");
  table.className =
    "min-w-full overflow-hidden border-collapse rounded-lg table-fixed-layout";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.className = "bg-blue-500";

  const headers = Object.keys(data[0]).filter((key) => key !== "id");
  const columnWidths = {
    userId: "w-2/12",
    title: "w-4/12",
    body: "w-6/12",
  };

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.className = `px-4 py-4 text-sm font-semibold text-center text-white uppercase tracking-wider ${columnWidths[headerText] || ""}`;

    let displayHeaderText = headerText;
    if (headerText === "userId") {
      displayHeaderText = "ID";
    } else if (headerText === "title") {
      displayHeaderText = "Title";
    } else if (headerText === "body") {
      displayHeaderText = "Body";
    } else {
      displayHeaderText = headerText.replace(/([A-Z])/g, " $1").trim();
    }
    th.textContent = displayHeaderText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach((rowData, index) => {
    const tr = document.createElement("tr");
    tr.className = `drop-shadow-lg drop-shadow-white ${rowData.body.toLowerCase().includes("rerum") ? "bg-sky-200" : index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-blue-300 transition duration-150 ease-in-out`;

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
