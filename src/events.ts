import { Dispatch, SetStateAction } from 'react';
import { backendUrl } from './config';
import { TodoList } from './types/Todo';

const events = (
  todoListId: TodoList['id'],
  setTodoList: Dispatch<SetStateAction<TodoList | undefined>>,
) => {
  const events = new EventSource(`${backendUrl}events/${todoListId}`);

  events.onmessage = (event) => {
    const { id, title, todos } = JSON.parse(event.data);
    setTodoList({
      id,
      title,
      todos,
    });
  };
};

export default events;
