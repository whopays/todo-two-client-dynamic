import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { TextField } from '@mui/material';
import ADD_TODO from '../../apollo/mutations/addTodo';
import todoListContext from '../../context/todoListContext';
import { insertNewElementId } from '../../config';
import addNewTodo from 'src/apollo/actions/addNewTodo';

export default function NewTodo() {
  const [value, setValue] = useState('');
  const { todoListId, todoList } = useContext(todoListContext);

  const [mutateFunction, { error }] = useMutation(ADD_TODO);

  const submit = () => {
    if (value === '') {
      return;
    }

    addNewTodo({ mutateFunction, todoListId, value });

    setValue('');
  };

  return (
    <>
      <TextField
        multiline
        disabled={!!todoList?.deleted}
        inputProps={{ 'data-cy': insertNewElementId, maxLength: 1024 }}
        fullWidth
        placeholder="👉🏻📝✅ (type new to do here)"
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
