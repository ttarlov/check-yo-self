var globalButtonEventListener = document.querySelector('body');
var taskTitleInput = document.querySelector('.title-input-js');
var taskItemInput = document.querySelector('.task-input-js');
var unsavedTasks = document.querySelector('.unsaved-tasks');
var potentialToDo = new ToDoList();
var taskContainer = document.querySelector('.task-card-container');
var addTaskBtn = document.querySelector('.add-task-btn-js');
var makeTaskListBtn = document.querySelector('.make-task-btn-js');
var savedTaskContainer = document.querySelector('.saved-tasks-container');

globalButtonEventListener.addEventListener('click', globalButtonEventHandler);
taskItemInput.addEventListener('keyup', checkTaskItemInput);
taskTitleInput.addEventListener('keyup', checkTaskItemInput);

function globalButtonEventHandler(event) {
  if (event.target.classList.contains('add-task-btn-js')) {
    console.log('add task button pressed');
    displayUnsavedTasks();
  } else if (event.target.classList.contains('clear-btn-js')) {
    console.log('clear button pressed');
  } else if (event.target.classList.contains('filter-btn-js')) {
    console.log('filter button pressed');
  } else if (event.target.classList.contains('make-task-btn-js')) {
    console.log('make task button pressed', event.target);
    incertTaskCard();
  } else if (event.target.classList.contains('delete-img')) {
    deleteUnsavedTask(event);
  }
}

function displayUnsavedTasks() {
  addTaskBtn.disabled = true;
  var task = new Task(taskItemInput.value);
  unsavedTasks.insertAdjacentHTML('afterbegin',
  `<div class="saved-task-img">
    <img class="delete-img" data-id="${task.id}" src="assets/delete.svg" alt="checkbox"></img>
    <span class="single-task">${task.content}</span>
  </div>`);
  potentialToDo.addTask(task);
  console.log(potentialToDo.tasks);
  taskItemInput.value = '';
}

function generateId() {
  return Date.now();
}

function checkTaskItemInput() {
  // console.log(potentialToDo.tasks.length);
  if (potentialToDo.tasks.length > 0 && taskTitleInput.value.length > 0) {
    console.log(potentialToDo.tasks.length);
    makeTaskListBtn.disabled = false;
  } else if (taskItemInput.value.length > 0) {
    // console.log('Whats inside tasks array', potentialToDo.tasks);
    addTaskBtn.disabled = false;
  }
}

function deleteUnsavedTask(event) {
  let taskToRemove = event.target.dataset.id;
  potentialToDo.removeTask(taskToRemove);
  event.target.closest('.saved-task-img').remove();
}

function incertTaskCard() {
  makeTaskListBtn.disabled = true;
  addTaskBtn.disabled = true;
  taskContainer.insertAdjacentHTML('afterbegin', `<div class="task-card">
    <h2> ${taskTitleInput.value}</h2>
    <div class="saved-tasks-container">
    </div>
    <div class="urgency-delete-container">
      <div class="urgent-img-tag">
        <img src="assets/urgent.svg" alt="urgency level">
        <p>urgent</p>
      </div>
      <div class="delete-img-tag">
        <img src="assets/delete.svg" alt="delete card button">
        <p>delete</p>
      </div>
    </div>
  </div>`);
  taskTitleInput.value = '';
  let taskOnToDoCard = document.querySelector('.saved-tasks-container');
  extractTask(taskOnToDoCard);
}

function extractTask(taskOnToDoCard) {
  let taskObj = potentialToDo.tasks;
  console.log(taskObj[0]);
  for (var i = 0; i < taskObj.length; i++) {
    taskOnToDoCard.insertAdjacentHTML('beforeend', `<div class="saved-tasks">
        <div class="saved-task-img">
          <img class="checkbox-img" src="assets/checkbox.svg" alt="checkbox"></img>
          <span class="single-task">${taskObj[i].content}</span>
        </div>
      </div>`);
  }
}

function clearUnsavedToDoTasks() {
  potentialToDo.task = [];
  unsavedTasks.innerHtml = '';
}
