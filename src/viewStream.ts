import { Dispatch, SetStateAction } from 'react';
import { backendUrl } from './config';
import { TodoList, User } from './types/Todo';

const viewStream = (
  todoListId: TodoList['id'],
  randomIdForEvents: string,
  setUsers: Dispatch<SetStateAction<Array<User>>>,
) => {
  const events = new EventSource(
    `${backendUrl}viewStream/${todoListId}/${randomIdForEvents}`,
  );
  events.onmessage = (event) => {
    const users: Array<User> = JSON.parse(event.data);

    setUsers(users);
  };
};

export default viewStream;
