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
var searchField = document.querySelector('.search-field');
var toDosList = [];

globalButtonEventListener.addEventListener('click', globalButtonEventHandler);
taskTitleInput.addEventListener('input', checkTaskItemInput);
taskItemInput.addEventListener('input', checkTaskItemInput);
searchField.addEventListener('keyup', executeSearch);


window.onload = function () {
  displayNoToDosYetMsg();
  var savedTodoList = window.localStorage.getItem('toDoArr');
  if (localStorage.length > 0) {
    toDosList = toDosList.concat(JSON.parse(savedTodoList));
  } else {
    toDosList = [];
  }

  displaySavedCardsInDom();
};

function globalButtonEventHandler(event) {
  if (event.target.classList.contains('add-task-btn-js')) {
    displayUnsavedTasks();
    checkTaskItemInput();
  } else if (event.target.classList.contains('clear-btn-js')) {
    clearUnsavedToDoTasks();
  } else if (event.target.classList.contains('filter-btn-js')) {
    filterByUrgency();
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
  } else if (event.target.classList.contains('checkbox-img')) {
    changeTaskToChecked(event);
    identifyObjectToUpdate(event);
  } else if (event.target.classList.contains('search-btn')) {
    console.log('search button clicked');
    executeSearch();
  }
}

function displayUnsavedTasks() {
  clearBtn.classList.remove('button-inactive');
  addTaskBtn.disabled = false;
  var task = new Task(taskItemInput.value);
  unsavedTasks.insertAdjacentHTML('beforeend',
  `<div class="saved-task-img">
    <img class="delete-img" data-id="${task.id}" src="Assets/delete.svg" alt="checkbox"></img>
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
        <img class="urgent-btn" id="urgent-btn-js" data-id="${potentialToDo.id}" src="Assets/urgent.svg" alt="urgency level">
        <p>urgent</p>
      </div>
      <div class="delete-img-tag">
        <img class="delete-task-card" src="Assets/delete.svg" data-id="${potentialToDo.id}" alt="delete card button">
        <p>delete</p>
      </div>
    </div>
  </div>`);
  potentialToDo.title = taskTitleInput.value;
  taskTitleInput.value = '';
  let taskOnToDoCard = document.querySelector('.saved-tasks-container');
  toDosList.push(potentialToDo);
  extractTask(taskOnToDoCard);
  clearUnsavedToDoTasks();
  putArrInLocalStorage(toDosList);
}

function extractTask(taskOnToDoCard) {
  var taskObj = potentialToDo.tasks;
  taskObj.forEach(task => {
    taskOnToDoCard.insertAdjacentHTML('beforeend', `<div class="saved-tasks">
        <div class="saved-task-img">
          <img class="checkbox-img not-checked"  data-id="${task.id}"
          src="assets/checkbox.svg" alt="checkbox"></img>
          <span class="single-task">${task.content}</span>
        </div>
      </div>`);
  });
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
  urgentBtn.classList.toggle('urgent');
  nearestToDoCard.classList.toggle('todo-card-urgent');
  if (urgentBtn.classList.contains('urgent')) {
    urgentBtn.src = 'Assets/urgent-active.svg';
  } else {
    urgentBtn.src = 'Assets/urgent.svg';
  }
}

function putArrInLocalStorage(array) {
  potentialToDo.saveToStorage(array);
}

function updateTaskCardsArr(event) {
  var toDosToRemove = toDosList.find(todo => todo.id == event.target.dataset.id
  );
  toDosList.splice(toDosList.indexOf(toDosToRemove), 1);
  potentialToDo.deleteFromStorage(toDosList);
  displayNoToDosYetMsg();
}

function changeTaskToChecked(event) {
  let checkBox = event.target.closest('.checkbox-img');
  if (checkBox.classList.contains('not-checked')) {
    checkBox.src = 'Assets/checkbox-active.svg';
    checkBox.classList.remove('not-checked');
  } else {
    checkBox.src = 'Assets/checkbox.svg';
    checkBox.classList.add('not-checked');
  }
}

function displaySavedCardsInDom() {
  toDosList.forEach(todo => {
    taskContainer.insertAdjacentHTML('afterbegin', `<div class="task-card" data-id='${todo.id}'>
    <h2>${todo.title}</h2>
    <div class="saved-tasks-container" id="saved-${todo.id}">
    </div>
    <div class="urgency-delete-container">
      <div class="urgent-img-tag">
        <img class="urgent-btn" id="urgent-btn-js"  data-id="${todo.id}" src="Assets/urgent.svg" alt="urgency level">
        <p>urgent</p>
      </div>
      <div class="delete-img-tag">
        <img class="delete-task-card" src="Assets/delete.svg" data-id="${todo.id}" alt="delete card button">
        <p>delete</p>
      </div>
    </div>
  </div>`);
    updateDomUrgencyStatus(todo);
    var savedContainer = document.querySelector(`#saved-${todo.id}`);
    loopOverTasks(todo.tasks, savedContainer);
  });
}

function loopOverTasks(tasks, container) {
  tasks.forEach(task => {
  var checkBoxClass;
  var emptyCheckBox = 'Assets/checkbox.svg';
  if (task.completed === true) {
    emptyCheckBox = 'Assets/checkbox-active.svg';
    checkBoxClass = '';
  } else {
    emptyCheckBox = 'Assets/checkbox.svg';
    checkBoxClass = 'not-checked';
  }
  container.insertAdjacentHTML('beforeend', `<div class="saved-tasks">
    <div class="saved-task-img">
      <img class="checkbox-img ${checkBoxClass}"  data-id="${task.id}"
      src="${emptyCheckBox}" alt="checkbox"></img>
      <span class="single-task">${task.content}</span>
    </div>
  </div>`);
  });
}


function displayNoToDosYetMsg() {
  if (localStorage.toDoArr.length < 3 ) {
    noNewTaskYet.classList.remove('hidden');
  } else {
    noNewTaskYet.classList.add('hidden');
  }
}

function fetchList() {
  var listId = event.target.dataset.id;
  var matchedTodo = toDosList.find(toDoObj => toDoObj.id == listId);
  var toDoReinstantiated = new ToDoList(matchedTodo)
  return toDoReinstantiated;
}

function updateToDoObjUrgencyStat(event) {
  var toDoReinstantiated = fetchList();
  toDoReinstantiated.changeUrgency();
  updateToDoCardInArr(toDoReinstantiated);
}

function updateToDoCardInArr(toDoToUpdate) {
  let cardToUpdate = toDosList.find(toDoObj => toDoObj.id == toDoToUpdate.id);
  let indexToUpdate = toDosList.indexOf(cardToUpdate)
  toDosList.splice(indexToUpdate, 1, toDoToUpdate);
  toDoToUpdate.saveToStorage(toDosList);
}

function updateDomUrgencyStatus(list) {
  let urgentBtn = document.querySelector('#urgent-btn-js');
  if (list.urgent === true) {
    urgentBtn.classList.add('urgent');
    urgentBtn.src = 'Assets/urgent-active.svg';
    urgentBtn.closest('.task-card').classList.add('todo-card-urgent');
  } else {
    urgentBtn.classList.remove('urgent');
    urgentBtn.src = 'Assets/urgent.svg';
    urgentBtn.closest('.task-card').classList.remove('todo-card-urgent');
  }
}

function identifyObjectToUpdate(event) {
  var toDoCardId = event.target.closest('.task-card').dataset.id;
  var matchedToDoObj = toDosList.find(function (todo) {
    return todo.id == toDoCardId;
  });

  identifyTaskToUpdate(matchedToDoObj);
}

function identifyTaskToUpdate(toDo) {
  var checkMarkImgId = event.target.dataset.id;
  var arrayOfTasks = toDo.tasks;
  var matchedTask = arrayOfTasks.find(function (task) {
    return task.id == checkMarkImgId;
  });

  updateTaskObjCheckStatus(matchedTask);
}

function updateTaskObjCheckStatus(theTask) {
  let toDoCardId = event.target.closest('.task-card').dataset.id;
  theTask.completed = !theTask.completed;
  let matchedTodo = toDosList.find(toDoObj => toDoObj.id == toDoCardId);
  let toDoReinstantiated = new ToDoList(matchedTodo);
  updateToDoCardInArr(toDoReinstantiated);
}

function filterByUrgency() {
  let allNonUrgentCards = [...taskContainer.querySelectorAll('.task-card')];
  allNonUrgentCards.forEach(function (card) {
    if (!card.classList.contains("todo-card-urgent")) {
      card.classList.toggle('hidden');
    }
  });
}


function executeSearch() {
  var filter = searchField.value.toUpperCase();
  var cardTitle = [...document.getElementsByTagName('h2')]
  cardTitle.forEach(title => {
   if(title.innerText.toUpperCase().indexOf(filter) > -1) {
     title.parentElement.closest('.task-card').style.display = "";
   }  else {
     title.closest('.task-card').style.display = 'none';
   }

  });
}
