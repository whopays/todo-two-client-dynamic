import { createContext, Dispatch, SetStateAction } from 'react';
import { TodoList } from '../types/Todo';

const todoListContext = createContext<{
  todoListId?: string;
  setTodoListId: Dispatch<SetStateAction<string>>;
  todoList?: TodoList;
  setTodoList: Dispatch<SetStateAction<TodoList | undefined>>;
}>({
  setTodoListId() {},
  setTodoList() {},
});

export default todoListContext;
