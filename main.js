var globalButtonEventListener = document.querySelector('body');
var taskTitleInput = document.querySelector('.title-input-js');
var taskItemInput = document.querySelector('.task-input-js');
var unsavedTasks = document.querySelector('.unsaved-tasks');
var potentialToDo = new ToDoList();

globalButtonEventListener.addEventListener('click', globalButtonEventHandler);
taskItemInput.addEventListener('click', clearInput);
taskTitleInput.addEventListener('click', clearInput);

function globalButtonEventHandler(event) {
  if (event.target.classList.contains('add-task-btn-js')) {
    console.log('add task button pressed');
    displayUnsavedTaskes();
  } else if (event.target.classList.contains('clear-btn-js')) {
    console.log('clear button pressed');
  } else if (event.target.classList.contains('filter-btn-js')) {
    console.log('filter button pressed');
  } else if (event.target.classList.contains('make-task-btn-js')) {
    console.log('make task button pressed', event.target);
  } else if (event.target.classList.contains('delete-img')) {
    deleteUnsavedTask(event);
    // console.log(event.target.classList);
  }
}

function displayUnsavedTaskes() {
  // debugger
  var task = new Task(taskItemInput.value);
  unsavedTasks.insertAdjacentHTML('afterbegin',
  `<div class="saved-task-img">
    <img class="delete-img" data-id="${task.id}" src="assets/delete.svg" alt="checkbox"></img>
    <span class="single-task">${task.content}</span>
  </div>`);
  potentialToDo.addTask(task);
  console.log(potentialToDo.tasks);
  taskItemInput.value = 'Add Another Task Name';
}

function generateId() {
  return Date.now();
}

function clearInput() {
  if (event.target.classList.contains('title-input')) {
    taskTitleInput.value = '';
  } else if (event.target.classList.contains('task-input')) {
    taskItemInput.value = '';
  }
}

function deleteUnsavedTask(event) {
  let taskToRemove = event.target.dataset.id;
  potentialToDo.removeTask(taskToRemove);
  event.target.closest('.saved-task-img').remove();
}

function incertTaskCard() {
  
}
