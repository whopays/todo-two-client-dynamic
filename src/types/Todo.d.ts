export interface TodoList {
  id: string;
  title: string;
  todos: Array<Todo>;
  deleted?: Boolean;
}

export interface Todo {
  id: string;
  name: string;
  checked: boolean;
}

export interface TodoListResponse {
  todoList: TodoList;
}

export interface User {
  userId: string;
  todoId: Todo['id'];
}
