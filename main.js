var globalButtonEventListener = document.querySelector('body');
var taskTitleInput = document.querySelector('.title-input-js');
var taskItemInput = document.querySelector('.task-input-js');
var unsavedTasks = document.querySelector('.unsaved-tasks');
var potentialToDo = new ToDoList();

globalButtonEventListener.addEventListener('click', globalButtonEventHandler);



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
  }
}

function displayUnsavedTaskes() {
  // debugger
  var task = new Task(taskItemInput.value);
  unsavedTasks.insertAdjacentHTML('beforeend',
  `<div class="saved-task-img">
    <img class="checkbox-img" src="assets/delete.svg" alt="checkbox"></img>
    <span class="single-task">${task.content}</span>
  </div>`);
  potentialToDo.addTask(task);
  console.log(potentialToDo.tasks);
}

function generateId() {
  return Date.now();
}
