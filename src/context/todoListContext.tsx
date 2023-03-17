import { createContext, Dispatch, SetStateAction } from 'react';
import { TodoList, User } from '../types/Todo';

const todoListContext = createContext<{
  todoListId?: string;
  setTodoListId: Dispatch<SetStateAction<string>>;
  todoList?: TodoList;
  setTodoList: Dispatch<SetStateAction<TodoList | undefined>>;
  users?: Array<User>;
  setUsers: Dispatch<SetStateAction<Array<User>>>;
}>({
  setTodoListId() {},
  setTodoList() {},
  setUsers() {},
});

export default todoListContext;
