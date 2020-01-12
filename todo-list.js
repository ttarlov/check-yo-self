class ToDoList {
  constructor() {
    this.id =
    this.title =
    this.urgent = false;
    this.tasks = [];
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
}
