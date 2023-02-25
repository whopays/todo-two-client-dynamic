import { TodoList } from 'src/types/Todo';

const key = 'previousTodoLists';

interface TodoListFromLocalStorage {
  id: TodoList['id'];
  title: TodoList['title'];
}

export const getPreviousTodoLists = (): Array<TodoListFromLocalStorage> => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const removeTodoList = (todoListId: TodoList['id']) => {
  const previousTodoLists = getPreviousTodoLists();
  const previousWithoutCurrentTodoLists = previousTodoLists.filter(
    ({ id }) => id !== todoListId,
  );
  localStorage.setItem(key, JSON.stringify(previousWithoutCurrentTodoLists));
};

export const addTodoList = (todoList: TodoList) => {
  const previousTodoLists = getPreviousTodoLists();
  const previousWithoutCurrentTodoLists = previousTodoLists.filter(
    ({ id }) => id !== todoList.id,
  );
  localStorage.setItem(
    key,
    JSON.stringify([
      ...previousWithoutCurrentTodoLists,
      { id: todoList.id, title: todoList.title },
    ]),
  );
};
