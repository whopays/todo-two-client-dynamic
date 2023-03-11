import { Dispatch, SetStateAction } from 'react';
import { backendUrl } from './config';
import { TodoList } from './types/Todo';

const events = (
  todoListId: TodoList['id'],
  setTodoList: Dispatch<SetStateAction<TodoList | undefined>>,
) => {
  const events = new EventSource(`${backendUrl}events/${todoListId}`);
  console.log();
  events.onmessage = (event) => {
    const { id, title, todos, deleted } = JSON.parse(event.data);
    deleted && console.log('deleted', deleted);
    setTodoList({
      id,
      title,
      todos,
      deleted,
    });
  };
};

export default events;
