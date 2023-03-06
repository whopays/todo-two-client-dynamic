import { ApolloCache } from '@apollo/client';
import GET_TODOS from '../../apollo/queries/getTodos';
import { TodoListResponse, Todo as ITodo } from '../../types/Todo';
import { temporaryNewId } from '../../config';

export default function addNewTodo({
  mutateFunction,
  todoListId,
  value,
}: {
  mutateFunction: Function;
  todoListId: string | undefined;
  value: string;
}) {
  mutateFunction({
    variables: {
      todoListId: todoListId,
      name: value,
    },
    update: (
      proxy: ApolloCache<any>,
      { data: { putTodo } }: { data: { putTodo: ITodo } },
    ) => {
      const data: TodoListResponse | null = proxy.readQuery({
        query: GET_TODOS,
        variables: {
          id: todoListId,
        },
      });

      if (!data) return;

      proxy.writeQuery({
        query: GET_TODOS,
        data: {
          todoList: {
            ...data.todoList,
            todos: [...data.todoList.todos, putTodo],
          },
        },
        variables: {
          id: todoListId,
        },
      });
    },
    optimisticResponse: {
      putTodo: {
        id: temporaryNewId + Math.random(),
        name: value,
        checked: false,
        __typename: 'Todo',
      },
    },
  });
}
