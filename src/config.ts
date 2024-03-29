export const insertNewElementId = 'insert-todo';
export const deleteElementId = 'delete-todo';
export const todoInputElementId = 'todo';
export const todoListTitleId = 'edit-todo-list-title';
export const deleteTodoListId = 'delete-todo-list';
export const confirmTodoListDeleteId = 'confirm-todo-list-delete';
export const previousTodoListsId = 'previous-todo-list';
export const previousTodoListDropdownItemId =
  'previous-todo-list-dropdown-item';
export const previousTodoListDeleteItemId = 'previous-todo-list-delete-item';
export const loadingTodoId = 'loading-todo';

export const isDev =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const backendUrl = isDev
  ? 'http://localhost:4000/'
  : 'https://todo-two-server.onrender.com/';

export const temporaryNewId = 'tempId';
