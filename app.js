document.addEventListener("DOMContentLoaded", () => {
  // 1. Select elements strictly using data-testid for test resilience
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const toggleCheckbox = document.querySelector(
    '[data-testid="test-todo-complete-toggle"]',
  );
  const statusElement = document.querySelector(
    '[data-testid="test-todo-status"]',
  );
  const timeRemainingElement = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
  );
  const dueDateElement = document.querySelector(
    '[data-testid="test-todo-due-date"]',
  );
  const editBtn = document.querySelector(
    '[data-testid="test-todo-edit-button"]',
  );
  const deleteBtn = document.querySelector(
    '[data-testid="test-todo-delete-button"]',
  );

  // 2. Checkbox Toggle Behavior
  toggleCheckbox.addEventListener("change", (e) => {
    const isCompleted = e.target.checked;

    if (isCompleted) {
      // Visually strike-through and fade (handled by CSS we wrote earlier)
      card.classList.add("completed");
      // Update semantic status
      statusElement.textContent = "Done";
      
    } else {
      card.classList.remove("completed");
      statusElement.textContent = "In Progress";
    }
  });

  // 3. Edit & Delete Dummy Actions
  editBtn.addEventListener("click", () => {
    console.log("edit clicked");
  });

  deleteBtn.addEventListener("click", () => {
    alert("Delete clicked");
  });

  // 4. Time Remaining Calculation Logic
  function updateTimeRemaining() {
    // Read the machine-readable date we set in the HTML
    const dueDateIso = dueDateElement.getAttribute("datetime");
    if (!dueDateIso) return;

    const dueDate = new Date(dueDateIso);
    const now = new Date();

    // Calculate the difference in milliseconds
    const diffMs = dueDate - now;
    const isOverdue = diffMs < 0;

    // Convert to hours and days
    const absDiffMs = Math.abs(diffMs);
    const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    let friendlyText = "";

    // Formatting logic based on Acceptance Criteria
    if (isOverdue) {
      if (hours === 0) {
        friendlyText = "Due now!";
      } else if (days === 0) {
        friendlyText = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
      } else {
        friendlyText = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
      }
    } else {
      if (days === 0 && hours === 0) {
        friendlyText = "Due now!";
      } else if (days === 0) {
        friendlyText = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
      } else if (days === 1) {
        friendlyText = "Due tomorrow";
      } else {
        friendlyText = `Due in ${days} days`;
      }
    }

    // Update the DOM. Because this span has aria-live="polite",
    // screen readers will announce this change gracefully.
    timeRemainingElement.textContent = friendlyText;
  }

  // Initialize the time remaining hint immediately
  updateTimeRemaining();

  // Refresh roughly every 60 seconds to keep the hint accurate
  setInterval(updateTimeRemaining, 60000);
});
