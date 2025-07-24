//  === localStorage helper ===

// get task from localStorage
function getTaskFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// save tasks to localStorage
function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 1.Get reference to the input, button, and list
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// 2. Listen for click on "Add" button
addTaskBtn.addEventListener("click", function () {
  const taskText = taskInput.value.trim(); //Get the text and remove the extra spaces

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  const newTask = { text: taskText, completed: false };
  createTaskElement(newTask);

  saveTasksToStorage(getAllTasksFromDOM());

  taskInput.value = "";
});

// 3.Create a new list item(task)
function createTaskElement(taskObj) {
  const li = document.createElement("li");

  // 4. create the span for task text
  const span = document.createElement("span");
  span.textContent = taskObj.text;
  span.classList.add("task-text");
  if (taskObj.completed) span.classList.add("task-completed");

// 5.create the complete check box
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = taskObj.completed;

// 6. when checkbox is clicked, toggle complete style
  checkbox.addEventListener("change", () => {
    span.classList.toggle("task-completed");
    taskObj.completed = checkbox.checked;
    saveTasksToStorage(getAllTasksFromDOM());
  });

// 7. create the delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";

// 8. When delete button is click, remove the task
  deleteBtn.addEventListener("click", function () {
    li.remove();
    saveTasksToStorage(getAllTasksFromDOM());
  });

// 9.Put everything into the list item
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}

// Read all current tasks from the screen and return as array
function getAllTasksFromDOM() {
  const item = document.querySelectorAll("#task-list li");
  const tasks = [];
  item.forEach((item) => {
    const text = item.querySelector(".task-text").textContent;
    const completed = item.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text, completed });
  });
  return tasks;
}

//  Handle filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
     // Remove "Active" class from all button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    // add "active" class to clicked button
    button.classList.add("active");

    const filter = button.getAttribute("data-filter"); //all, active, complete
    const tasks = document.querySelectorAll("#task-list li");
      tasks.forEach((task) => {
      const checkbox = task.querySelector('input[type="checkbox"]');
      const isCompleted = checkbox.checked;

    if (filter === "all") {
      task.style.display = "flex";
    } else if (filter === "active") {
      task.style.display = isCompleted ? "none" : "flex";
    } else if (filter === "completed") {
      task.style.display = isCompleted ? "flex" : "none";
    }
  });
});
});

//  Clear completed tasks 
const clearCompletedBtn = document.getElementById("clear-completed-btn");

clearCompletedBtn.addEventListener('click', () => {
  const tasks = document.querySelectorAll("#task-list li");

  tasks.forEach((task) => {
    const checkbox = task.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      task.remove();
    }
  });
  
  // localStorage after removing completed tasks
  saveTasksToStorage(getAllTasksFromDOM());
});


// load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const storedTasks = getTaskFromStorage();
  storedTasks.forEach((task) => createTaskElement(task));
});
