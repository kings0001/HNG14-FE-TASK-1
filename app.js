document.addEventListener("DOMContentLoaded", () => {
  // --- 1. State Management ---
  let todoState = {
    title: "Build Testable Todo Card",
    description:
      "Create a clean, modern task component ensuring strict semantic HTML, WCAG AA contrast, and perfect responsiveness from 320px to 1200px. This description has been extended to demonstrate the new expand and collapse functionality required by the advanced specifications.",
    priority: "High", // Low, Medium, High
    status: "In Progress", // Pending, In Progress, Done
    dueDate: "2026-04-15T18:00",
  };

  // --- 2. DOM Elements (Strictly TestIDs where provided) ---
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const viewContainer = document.getElementById("view-mode-container");

  // View Elements
  const toggleCheckbox = document.querySelector(
    '[data-testid="test-todo-complete-toggle"]',
  );
  const titleDisplay = document.querySelector(
    '[data-testid="test-todo-title"]',
  );
  const descDisplay = document.querySelector(
    '[data-testid="test-todo-description"]',
  );
  const priorityDisplay = document.querySelector(
    '[data-testid="test-todo-priority"]',
  );
  const statusDisplay = document.querySelector(
    '[data-testid="test-todo-status"]',
  );
  const statusSelect = document.querySelector(
    '[data-testid="test-todo-status-control"]',
  );
  const dueDateDisplay = document.querySelector(
    '[data-testid="test-todo-due-date"]',
  );
  const timeRemainingText = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
  );
  const overdueBadge = document.querySelector(
    '[data-testid="test-todo-overdue-indicator"]',
  );

  // Interaction Elements
  const expandBtn = document.querySelector(
    '[data-testid="test-todo-expand-toggle"]',
  );
  const collapseSection = document.querySelector(
    '[data-testid="test-todo-collapsible-section"]',
  );
  const editBtn = document.querySelector(
    '[data-testid="test-todo-edit-button"]',
  );
  const deleteBtn = document.querySelector(
    '[data-testid="test-todo-delete-button"]',
  );

  // Form Elements
  const editForm = document.querySelector(
    '[data-testid="test-todo-edit-form"]',
  );
  const editTitleInput = document.querySelector(
    '[data-testid="test-todo-edit-title-input"]',
  );
  const editDescInput = document.querySelector(
    '[data-testid="test-todo-edit-description-input"]',
  );
  const editPrioritySelect = document.querySelector(
    '[data-testid="test-todo-edit-priority-select"]',
  );
  const editDateInput = document.querySelector(
    '[data-testid="test-todo-edit-due-date-input"]',
  );
  const cancelBtn = document.querySelector(
    '[data-testid="test-todo-cancel-button"]',
  );

  // --- 3. Core Render Function ---
  // Syncs the DOM to match the current todoState
  function renderView() {
    titleDisplay.textContent = todoState.title;
    descDisplay.textContent = todoState.description;

    // Priority Update
    priorityDisplay.textContent = todoState.priority;
    card.setAttribute("data-priority", todoState.priority);

    // Date Update
    const dateObj = new Date(todoState.dueDate);
    dueDateDisplay.setAttribute("datetime", todoState.dueDate);
    dueDateDisplay.textContent = `Due ${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    // Status & Checkbox Sync Logic
    statusDisplay.textContent = todoState.status;
    statusSelect.value = todoState.status;

    card.classList.remove("completed", "in-progress");

    if (todoState.status === "Done") {
      toggleCheckbox.checked = true;
      card.classList.add("completed");
    } else {
      toggleCheckbox.checked = false;
      if (todoState.status === "In Progress") {
        card.classList.add("in-progress");
      }
    }

    checkCollapsible();
    updateTimeRemaining();
  }

  // --- 4. Expand / Collapse Logic ---
  let isExpanded = false;

  function checkCollapsible() {
    // If text is short, hide the toggle button
    if (descDisplay.scrollHeight <= collapseSection.clientHeight) {
      expandBtn.classList.add("hidden");
    } else {
      expandBtn.classList.remove("hidden");
    }
  }

  expandBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      collapseSection.classList.add("expanded");
      expandBtn.textContent = "Show less";
    } else {
      collapseSection.classList.remove("expanded");
      expandBtn.textContent = "Show more";
    }
  });

  // --- 5. Status Interaction Logic ---
  toggleCheckbox.addEventListener("change", (e) => {
    todoState.status = e.target.checked ? "Done" : "Pending";
    renderView();
  });

  statusSelect.addEventListener("change", (e) => {
    todoState.status = e.target.value;
    renderView();
  });

  // --- 6. Edit Mode Logic ---
  function openEditMode() {
    // Populate form with current state
    editTitleInput.value = todoState.title;
    editDescInput.value = todoState.description;
    editPrioritySelect.value = todoState.priority;
    editDateInput.value = todoState.dueDate;

    viewContainer.classList.add("hidden");
    editForm.classList.remove("hidden");
    editTitleInput.focus(); // Trap/shift focus
  }

  function closeEditMode() {
    editForm.classList.add("hidden");
    viewContainer.classList.remove("hidden");
    editBtn.focus(); // Return focus to edit button per requirements
  }

  editBtn.addEventListener("click", openEditMode);
  cancelBtn.addEventListener("click", closeEditMode);

  editForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    // Update state from inputs
    todoState.title = editTitleInput.value;
    todoState.description = editDescInput.value;
    todoState.priority = editPrioritySelect.value;
    todoState.dueDate = editDateInput.value;

    renderView();
    closeEditMode();
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      card.remove();
    }
  });

  // --- 7. Time Logic (Granular) ---
  function updateTimeRemaining() {
    if (todoState.status === "Done") {
      timeRemainingText.textContent = "Completed";
      card.classList.remove("is-overdue");
      overdueBadge.classList.add("hidden");
      return; // Stop processing time if done
    }

    const dueDate = new Date(todoState.dueDate);
    const now = new Date();
    const diffMs = dueDate - now;
    const isOverdue = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);

    // Calculate granular units
    const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absDiffMs / (1000 * 60)) % 60);

    let timeString = "";

    if (days > 0) {
      timeString = `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      timeString = `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      timeString = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    if (isOverdue) {
      timeRemainingText.textContent = `Overdue by ${timeString}`;
      card.classList.add("is-overdue");
      overdueBadge.classList.remove("hidden");
    } else {
      timeRemainingText.textContent = `Due in ${timeString}`;
      card.classList.remove("is-overdue");
      overdueBadge.classList.add("hidden");
    }
  }

  // Initialize
  renderView();

  // Check height after initial render
  window.addEventListener("resize", checkCollapsible);

  // Update time every 30 seconds
  setInterval(updateTimeRemaining, 30000);
});
