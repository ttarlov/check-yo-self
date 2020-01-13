class Task {
  constructor(content) {
    this.id = generateId();
    this.content = content;
    this.completed = false;
  }
}
