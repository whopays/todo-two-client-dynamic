import { useContext, useEffect, useState } from 'react';
import { Alert, Box, Button, LinearProgress } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { default as TodoComponent } from './Todo';
import NewTodo from './NewTodo';
import GET_TODOS from '../../apollo/queries/getTodos';
import { Todo } from '../../types/Todo';
import POST_TODO_LIST from '../../apollo/mutations/postTodoList';
import events, { randomIdForEvents } from '../../events';
import TodoListTitle from './TodoListTitle';
import {
  addTodoList,
  removeTodoList,
} from '../PreviousTodoLists/previousTodoList';
import todoListContext from 'src/context/todoListContext';
import Draggable from '../Draggable';
import UndoDeleteTodo from './UndoDeleteTodo';
import userActivity from 'src/viewStream';

export default function Todos() {
  const { todoList, setTodoList, todoListId, setTodoListId, setUsers } =
    useContext(todoListContext);
  const [deletedTextPack, setDeletedTextPack] = useState<Array<string>>([]);
  const addTextToDeletedPack = (text: string) =>
    setDeletedTextPack([...deletedTextPack, text]);

  const { loading, error, data } = useQuery(GET_TODOS, {
    variables: {
      id: todoListId,
    },
    skip: !todoListId,
  });

  useEffect(() => {
    if (data?.todoList) {
      addTodoList(data?.todoList);
      setTodoList(data?.todoList);
    }
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
          setTodoListId(postTodoList?.id);
          window.history.pushState(null, '', `/${postTodoList?.id}`);
        },
      });
    }
  }, [
    todoListId,
    postTodoData,
    postTodoMutateFunction,
    postTodoListLoading,
    setTodoListId,
    data,
  ]);

  useEffect(() => {
    if (todoListId) {
      events(todoListId, setTodoList);
      userActivity(todoListId, randomIdForEvents, setUsers);
    }
  }, [setTodoList, setUsers, todoListId]);

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
              todoListId && removeTodoList(todoListId);
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
      {todoList?.deleted && (
        <Alert severity="error">
          This twodoit was deleted. This operation can't be undone. The data you
          see is stored only locally. It's your last chance to see it.
        </Alert>
      )}
      <Box
        sx={{
          marginBottom: '3rem',
        }}
      >
        <TodoListTitle />
      </Box>

      <Draggable
        items={
          todoList?.todos?.map((todo: Todo) => {
            return {
              component: (
                <TodoComponent
                  {...todo}
                  key={todo?.id}
                  addTextToDeletedPack={addTextToDeletedPack}
                />
              ),
              id: todo?.id,
            };
          }) || []
        }
      />

      <UndoDeleteTodo
        deletedTextPack={deletedTextPack}
        setDeletedTextPack={setDeletedTextPack}
      />
      <NewTodo />
    </Box>
  );
}
