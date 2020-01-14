class ToDoList {
  constructor(todo) {
    this.id = todo.id || generateId();
    this.title = todo.title;
    this.urgent = todo.urgent || false;
    this.tasks = todo.tasks || [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskToRemove) {
    var tasksArr = this.tasks;
    var actualTaskToRemove = tasksArr.find(task => task.id == taskToRemove);
    var indexToRemove = tasksArr.indexOf(actualTaskToRemove);
    tasksArr.splice(indexToRemove, 1);
    console.log(this.tasks);
  }

  saveToStorage(array) {
    window.localStorage.setItem('toDoArr', JSON.stringify(array));
  }

  deleteFromStorage(array) {
    window.localStorage.setItem('toDoArr', JSON.stringify(array));
  }

  updateToDo() {

  }

  updateTask(toDosArray) {

  }

  changeUrgency() {
    this.urgent = !this.urgent;
  }

}
