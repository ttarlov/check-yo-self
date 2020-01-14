class Task {
  constructor(task) {
    this.id = task.id || generateId();
    this.content = task.content;
    this.completed = task.completed || false;
  }
}
