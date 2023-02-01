import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { InputAdornment, TextField } from '@mui/material';
import ADD_TODO from '../../apollo/mutations/addTodo';
import GET_TODOS from '../../apollo/queries/getTodos';
import todoListContext from '../../context/todoListContext';
import { TodoListResponse } from '../../types/Todo';
import { insertNewElementId, temporaryNewId } from '../../config';
import CircularProgress from '@mui/material/CircularProgress';

export default function NewTodo() {
  const [value, setValue] = useState('');
  const { todoListId } = useContext(todoListContext);

  const [mutateFunction, { loading, error }] = useMutation(ADD_TODO);

  const submit = async () => {
    if (value === '') {
      return;
    }

    mutateFunction({
      variables: {
        todoListId: todoListId,
        name: value,
      },
      update: (proxy, { data: { putTodo } }) => {
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

    setValue('');
  };

  return (
    <>
      <TextField
        inputProps={{ 'data-cy': insertNewElementId }}
        fullWidth
        placeholder="✍️✍️✍️"
        variant="standard"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={submit}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            submit();
            event.preventDefault();
          }
        }}
        value={value}
        error={!!error}
        helperText={
          error
            ? `Something went wrong, potentially in internet connection; full error: ${error}`
            : undefined
        }
      />
    </>
  );
}
