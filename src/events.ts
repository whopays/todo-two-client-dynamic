import { Dispatch, SetStateAction } from 'react';
import { backendUrl } from './config';
import { TodoList } from './types/Todo';

export const randomIdForEvents = Math.random().toString(36).substring(2);

const events = (
  todoListId: TodoList['id'],
  setTodoList: Dispatch<SetStateAction<TodoList | undefined>>,
) => {
  const events = new EventSource(`${backendUrl}events/${todoListId}`);
  events.onmessage = (event) => {
    const { id, title, todos, deleted } = JSON.parse(event.data);

    setTodoList({
      id,
      title,
      todos,
      deleted,
    });
  };

  window.addEventListener('beforeunload', () => {
    events.close();
  });
};

export default events;
