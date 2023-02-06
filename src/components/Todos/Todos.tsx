import { useEffect, useState } from 'react';
import { Alert, Box, Button, LinearProgress } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { default as TodoComponent } from './Todo';
import TodoListContext from '../../context/todoListContext';
import NewTodo from './NewTodo';
import GET_TODOS from '../../apollo/queries/getTodos';
import { TodoList, Todo } from '../../types/Todo';
import POST_TODO_LIST from '../../apollo/mutations/postTodoList';
import DeleteTodoList from './DeleteTodoList';
import events from '../../events';
import TodoListTitle from './TodoListTitle';

export default function Todos() {
  const [todoList, setTodoList] = useState<TodoList>();
  const [todoListId, setTodoListId] = useState<string>(
    window.location.pathname.split('/')[1],
  );

  const { loading, error, data } = useQuery(GET_TODOS, {
    variables: {
      id: todoListId,
    },
    skip: !todoListId,
  });

  useEffect(() => {
    setTodoList(data?.todoList);
  }, [setTodoList, data]);

  const [
    postTodoMutateFunction,
    { data: postTodoData, loading: postTodoListLoading, error: postTodoError },
  ] = useMutation(POST_TODO_LIST);

  useEffect(() => {
    if (todoListId !== '') return;

    if (!postTodoListLoading) {
      postTodoMutateFunction({
        update: (proxy, { data: { postTodoList } }) => {
          setTodoListId(postTodoList.id);
          window.history.pushState(null, '', `/${postTodoList.id}`);
        },
      });
    }
  }, [todoListId, postTodoData, postTodoMutateFunction, postTodoListLoading]);

  useEffect(() => {
    if (todoListId) {
      events(todoListId, setTodoList);
    }
  }, [todoListId]);

  if (loading || postTodoListLoading) return <LinearProgress />;
  if (error || postTodoError)
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        }
      >
        {`Not able to load the list due to connection issue: ${
          error || postTodoError
        }`}
      </Alert>
    );

  if (todoList === null)
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              window.history.pushState(null, '', '/');
              window.location.reload();
            }}
          >
            Create new list
          </Button>
        }
      >
        The list you specified in the URL ({todoListId}) was either deleted, or
        never existed.
      </Alert>
    );

  return (
    <Box
      sx={{
        maxWidth: '20rem',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'self-start',
        margin: '0 auto',
        paddingTop: '1rem',
      }}
    >
      <TodoListContext.Provider
        value={{
          todoListId,
          setTodoListId,
          todoList,
          setTodoList,
        }}
      >
        {todoList?.todos?.map((todo: Todo) => {
          return <TodoComponent {...todo} key={todo.id} />;
        })}
        <NewTodo />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '1rem',
            marginTop: '3rem',
          }}
        >
          <TodoListTitle />
          <DeleteTodoList id={todoListId} />
        </Box>
      </TodoListContext.Provider>
    </Box>
  );
}
