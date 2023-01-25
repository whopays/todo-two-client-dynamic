export interface TodoList {
  id: string;
  title: string;
  todos: Array<Todo>;
}

export interface Todo {
  id: string;
  name: string;
  checked: boolean;
}

export interface TodoListResponse {
  todoList: TodoList;
}
