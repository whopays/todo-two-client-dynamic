import { Dispatch, SetStateAction } from 'react';
import { backendUrl } from './config';
import { TodoList } from './types/Todo';

const userActivity = (
  todoListId: TodoList['id'],
  //   setTodoList: Dispatch<SetStateAction<TodoList | undefined>>,
) => {
  const events = new EventSource(`${backendUrl}userActivity/${todoListId}`);
  events.onmessage = (event) => {
    console.log(JSON.parse(event.data));
    // const { id, title, todos, deleted } = JSON.parse(event.data);

    // setTodoList({
    //   id,
    //   title,
    //   todos,
    //   deleted,
    // });
  };
};

export default userActivity;
