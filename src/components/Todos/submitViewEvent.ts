import { backendUrl } from 'src/config';
import { randomIdForEvents } from 'src/events';
import { Todo, TodoList } from 'src/types/Todo';

export function submitViewEvent({
  todoListId,
  todoId,
}: {
  todoListId: TodoList['id'];
  todoId: Todo['id'];
}) {
  fetch(`${backendUrl}postEvent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      todoListId,
      todoId,
      userId: randomIdForEvents,
    }),
  });
}
