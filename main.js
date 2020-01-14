var globalButtonEventListener = document.querySelector('body');
var taskTitleInput = document.querySelector('.title-input-js');
var taskItemInput = document.querySelector('.task-input-js');
var unsavedTasks = document.querySelector('.unsaved-tasks');
var potentialToDo = new ToDoList({});
var taskContainer = document.querySelector('.task-card-container');
var addTaskBtn = document.querySelector('.add-task-btn-js');
var makeTaskListBtn = document.querySelector('.make-task-btn-js');
var savedTaskContainer = document.querySelector('.saved-tasks-container');
var noNewTaskYet = document.querySelector('.no-new-task-yet-js');
var taskCard = document.querySelector('.task-card');
var clearBtn = document.querySelector('.clear-btn-js');
var toDosArray = [];

window.onload = function () {
  displayNoToDosYetMsg();
  var savedTodoArry = window.localStorage.getItem('toDoArr');
  if (localStorage.length > 0) {
    toDosArray = toDosArray.concat(JSON.parse(savedTodoArry));
  } else {
    toDosArray = [];
  }

  displaySavedCardsInDom();
};

globalButtonEventListener.addEventListener('click', globalButtonEventHandler);
taskTitleInput.addEventListener('input', checkTaskItemInput);
taskItemInput.addEventListener('input', checkTaskItemInput);

function globalButtonEventHandler(event) {
  if (event.target.classList.contains('add-task-btn-js')) {
    displayUnsavedTasks();
    checkTaskItemInput();
  } else if (event.target.classList.contains('clear-btn-js')) {
    clearUnsavedToDoTasks();
  } else if (event.target.classList.contains('filter-btn-js')) {
    console.log('filter button pressed');
  } else if (event.target.classList.contains('make-task-btn-js')) {
    incertTaskCard();
  } else if (event.target.classList.contains('delete-img')) {
    deleteUnsavedTask(event);
  } else if (event.target.classList.contains('delete-task-card')) {
    updateTaskCardsArr(event);
    event.target.closest('.task-card').remove();
  } else if (event.target.classList.contains('urgent-btn')) {
    changeToDoUrgency(event);
    updateToDoObjUrgencyStat(event);
  } else if (event.target.classList.contains('checkbox-img'))
    changeTaskToChecked(event);
    identifyObjectToUpdate(event);
}

function displayUnsavedTasks() {
  clearBtn.classList.remove('button-inactive');
  addTaskBtn.disabled = false;
  var task = new Task(taskItemInput.value);
  unsavedTasks.insertAdjacentHTML('beforeend',
  `<div class="saved-task-img">
    <img class="delete-img" data-id="${task.id}" src="assets/delete.svg" alt="checkbox"></img>
    <span class="single-task">${task.content}</span>
  </div>`);
  potentialToDo.addTask(task);
  taskItemInput.value = '';
}

function generateId() {
  return Date.now();
}

function checkTaskItemInput() {
  if (taskTitleInput.value.length > 0 && potentialToDo.tasks.length > 0) {
    console.log('length of tasks array', potentialToDo.tasks.length);
    clearBtn.classList.remove('button-inactive');
    clearBtn.disabled = false;
    makeTaskListBtn.disabled = false;
    makeTaskListBtn.classList.remove('button-inactive');
  } else if (taskItemInput.value.length > 0) {
    addTaskBtn.disabled = false;
    clearBtn.classList.remove('button-inactive');
    clearBtn.disabled = false;
  }
}

function deleteUnsavedTask(event) {
  let taskToRemove = event.target.dataset.id;
  potentialToDo.removeTask(taskToRemove);
  event.target.closest('.saved-task-img').remove();
}

function incertTaskCard() {
  noNewTaskYet.classList.add('hidden');
  makeTaskListBtn.disabled = true;
  makeTaskListBtn.classList.add('button-inactive');
  addTaskBtn.disabled = true;
  taskContainer.insertAdjacentHTML('afterbegin', `<div class="task-card" data-id="${potentialToDo.id}">
    <h2> ${taskTitleInput.value}</h2>
    <div class="saved-tasks-container">
    </div>
    <div class="urgency-delete-container">
      <div class="urgent-img-tag">
        <img class="urgent-btn not-urgent" id="urgent-btn-js" data-id="${potentialToDo.id}" src="assets/urgent.svg" alt="urgency level">
        <p>urgent</p>
      </div>
      <div class="delete-img-tag">
        <img class="delete-task-card" src="assets/delete.svg" data-id="${potentialToDo.id}" alt="delete card button">
        <p>delete</p>
      </div>
    </div>
  </div>`);
  potentialToDo.title = taskTitleInput.value;
  taskTitleInput.value = '';
  let taskOnToDoCard = document.querySelector('.saved-tasks-container');
  console.log('look inside POTENTIAL TO DO', potentialToDo.id);
  toDosArray.push(potentialToDo);
  extractTask(taskOnToDoCard);
  clearUnsavedToDoTasks();
  putArrInLocalStorage(toDosArray);
}

function extractTask(taskOnToDoCard) {
  let taskObj = potentialToDo.tasks;
  for (var i = 0; i < taskObj.length; i++) {
    taskOnToDoCard.insertAdjacentHTML('beforeend', `<div class="saved-tasks">
        <div class="saved-task-img">
          <img class="checkbox-img not-checked"  data-id="${taskObj[i].id}"
          src="assets/checkbox.svg" alt="checkbox"></img>
          <span class="single-task">${taskObj[i].content}</span>
        </div>
      </div>`);
  }
}

function clearUnsavedToDoTasks() {
  clearBtn.classList.add('button-inactive');
  clearBtn.disabled = true;
  makeTaskListBtn.disabled = true;
  unsavedTasks.innerHTML = '';
  taskItemInput.value = '';
  taskTitleInput.value = '';
  potentialToDo = new ToDoList({});
}

function changeToDoUrgency(event) {
  var nearestToDoCard = event.target.closest('.task-card');
  var urgentBtn = event.target.closest('#urgent-btn-js');
  if (urgentBtn.classList.contains('not-urgent')) {
    urgentBtn.src = 'assets/urgent-active.svg';
    urgentBtn.classList.remove('not-urgent');
    nearestToDoCard.classList.add('todo-card-urgent');

  } else {
    urgentBtn.src = 'assets/urgent.svg';
    urgentBtn.classList.add('not-urgent');
    nearestToDoCard.classList.remove('todo-card-urgent');
  }
}

function putArrInLocalStorage(array) {
  potentialToDo.saveToStorage(array);
}

function updateTaskCardsArr(event) {
  var toDosToRemove = toDosArray.find(function(todo) {
    return todo.id == event.target.dataset.id;
  });

  var indexToRemove = toDosArray.indexOf(toDosToRemove);
  toDosArray.splice(indexToRemove, 1);
  potentialToDo.deleteFromStorage(toDosArray);
  displayNoToDosYetMsg();
}

function changeTaskToChecked(event) {
  let checkBox = event.target.closest('.checkbox-img');
  if (checkBox.classList.contains('not-checked')) {
    checkBox.src = 'assets/checkbox-active.svg';
    checkBox.classList.remove('not-checked');
  } else {
    checkBox.src = 'assets/checkbox.svg';
    checkBox.classList.add('not-checked');
  }
}

function displaySavedCardsInDom() {
  for (var i = 0; i < toDosArray.length; i++) {
    taskContainer.insertAdjacentHTML('afterbegin', `<div class="task-card" data-id='${toDosArray[i].id}'>
    <h2>${toDosArray[i].title}</h2>
    <div class="saved-tasks-container" id="saved-${toDosArray[i].id}">
    </div>
    <div class="urgency-delete-container">
      <div class="urgent-img-tag">
        <img class="urgent-btn not-urgent" id="urgent-btn-js"  data-id="${toDosArray[i].id}" src="assets/urgent.svg" alt="urgency level">
        <p>urgent</p>
      </div>
      <div class="delete-img-tag">
        <img class="delete-task-card" src="assets/delete.svg" data-id="${toDosArray[i].id}" alt="delete card button">
        <p>delete</p>
      </div>
    </div>
  </div>`);
    updateDomUrgencyStatus(toDosArray[i]);
    var savedContainer = document.querySelector(`#saved-${toDosArray[i].id}`);
    console.log(toDosArray[i].id);
    loopOverTasks(toDosArray[i].tasks, savedContainer);
  }
}

function loopOverTasks(tasks, container) {
  for (var j = 0; j < tasks.length; j++) {
    container.insertAdjacentHTML('beforeend', `<div class="saved-tasks">
      <div class="saved-task-img">
        <img class="checkbox-img not-checked"  data-id="${tasks[j].id}"
        src="assets/checkbox.svg" alt="checkbox"></img>
        <span class="single-task">${tasks[j].content}</span>
      </div>
    </div>`);
  }
}

function displayNoToDosYetMsg() {
  // console.log(localStorage.toDoArr.length)
  if (localStorage.toDoArr.length < 3 ) {
    noNewTaskYet.classList.remove('hidden');
  } else {
    noNewTaskYet.classList.add('hidden');
  }
}

function fetchList() {
  var listId = event.target.dataset.id;
  console.log(listId);
  var matchedTodo = toDosArray.find(toDoObj => toDoObj.id == listId);
  console.log(matchedTodo);
  var toDoReinstantiated = new ToDoList(matchedTodo)
    return toDoReinstantiated;
}

function updateToDoObjUrgencyStat(event) {
  var toDoReinstantiated = fetchList();
  toDoReinstantiated.changeUrgency();
  console.log(toDoReinstantiated);
  updateToDoCardInArr(toDoReinstantiated);
}

function updateToDoCardInArr(toDoToUpdate) {
  let cardToUpdate = toDosArray.find(toDoObj => toDoObj.id == toDoToUpdate.id);
  let indexToUpdate = toDosArray.indexOf(cardToUpdate)
  toDosArray.splice(indexToUpdate, 1, toDoToUpdate);
  toDoToUpdate.saveToStorage(toDosArray);
  console.log(toDosArray);
}

function updateDomUrgencyStatus(arr) {
  let urgentBtn = document.querySelector('#urgent-btn-js');
  if (arr.urgent == true) {
    urgentBtn.src = 'assets/urgent-active.svg';
    urgentBtn.closest('.task-card').classList.add('todo-card-urgent');
  } else {
    urgentBtn.src = 'assets/urgent.svg';
    urgentBtn.closest('.task-card').classList.remove('todo-card-urgent');
  }
}



function identifyObjectToUpdate(event) {
  // fetchToDoObj();
  var toDoCardId = event.target.closest('.task-card').dataset.id;
  var matchedToDoObj = toDosArray.find(function (todo) {
    return todo.id == toDoCardId;
  });

  console.log(matchedToDoObj);
  // return matchedToDoObj;
  identifyTaskToUpdate(matchedToDoObj);
}

function identifyTaskToUpdate(toDo) {
  var checkMarkImgId = event.target.dataset.id;
  console.log('checkbox image', checkMarkImgId);
  var arrayOfTasks = toDo.tasks;
  var matchedTask = arrayOfTasks.find(function(task) {
    return task.id == checkMarkImgId;
  })
  console.log('matchedTask', matchedTask);
  updateTaskObjCheckStatus(matchedTask);
}

function updateTaskObjCheckStatus(theTask) {
  // debugger
  let toDoCardId = event.target.closest('.task-card').dataset.id;
  theTask.completed = !theTask.completed;
  console.log(theTask);
  console.log(toDosArray);
  let matchedTodo = toDosArray.find(toDoObj => toDoObj.id == toDoCardId);
  let toDoReinstantiated = new ToDoList(matchedTodo);
  console.log(toDoReinstantiated);
}
