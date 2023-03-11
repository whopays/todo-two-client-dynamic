import { useState, useContext, useEffect } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { useMutation } from '@apollo/client';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import HeightIcon from '@mui/icons-material/Height';
import { Todo as ITodo } from '../../types/Todo';
import GET_TODOS from '../../apollo/queries/getTodos';
import DELETE_TODO from '../../apollo/mutations/deleteTodo';
import EDIT_TODO from '../../apollo/mutations/editTodo';
import todoListContext from '../../context/todoListContext';
import { temporaryNewId, todoInputElementId } from '../../config';
import usePrevious from '../../hooks/usePrevious';
import DeleteTodo from './DeleteTodo';

export default function Todo({
  name,
  checked,
  id,
  addTextToDeletedPack,
}: ITodo & { addTextToDeletedPack: (text: string) => void }) {
  const [innerValue, setInnerValue] = useState(name);
  const { todoListId, todoList } = useContext(todoListContext);
  const previousName: ITodo['name'] = usePrevious<ITodo['name']>(name);

  useEffect(() => {
    if (innerValue !== name && previousName !== name) {
      setInnerValue(name);
    }
  }, [innerValue, name, previousName]);

  const [deleteFunction, { loading: isDeleting, error: deletingError }] =
    useMutation(DELETE_TODO);

  const [editFunction, { loading: isEditing, error: editingError }] =
    useMutation(EDIT_TODO);

  const deleteTodo = () => {
    addTextToDeletedPack(innerValue);

    deleteFunction({
      variables: {
        todoListId: todoListId,
        todoId: id,
      },
      refetchQueries: [GET_TODOS],
    });
  };

  const editTodo = async ({ checked }: { checked: ITodo['checked'] }) => {
    editFunction({
      variables: {
        todoListId: todoListId,
        todo: {
          id,
          checked,
        },
      },
      refetchQueries: [GET_TODOS],
    });
  };

  const submit = () => {
    editFunction({
      variables: {
        todoListId: todoListId,
        todo: {
          id,
          name: innerValue,
        },
      },
      refetchQueries: [GET_TODOS],
    });
  };

  const isUnavailable =
    id.startsWith(temporaryNewId) || isDeleting || isEditing;

  return (
    <Box display="flex" width="100%">
      <TextField
        inputProps={{
          'data-cy': todoInputElementId,
          maxLength: 512,
          style: {
            textDecoration: checked ? 'line-through' : 'initial',
          },
        }}
        disabled={isUnavailable || !!todoList?.deleted}
        fullWidth
        placeholder="✏️✏️✏️"
        variant="standard"
        onChange={(e) => {
          setInnerValue(e.target.value);
        }}
        onBlur={submit}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            submit();
            event.preventDefault();
          }
        }}
        value={innerValue}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                aria-label="toggle todo visibility"
                onClick={() => {
                  editTodo({
                    checked: !checked,
                  });
                }}
                edge="start"
                disabled={isUnavailable || !!todoList?.deleted}
              >
                {checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              aria-label="move todo up or down in order"
              disabled={isUnavailable || !!todoList?.deleted}
            >
              <HeightIcon />
            </IconButton>
          ),
        }}
        error={!!editingError || !!deletingError}
        helperText={
          !!editingError || !!deletingError
            ? `Something went wrong, potentially in internet connection; full error: ${
                editingError || deletingError
              }`
            : undefined
        }
      />
      <DeleteTodo isUnavailable={isUnavailable} deleteTodo={deleteTodo} />
    </Box>
  );
}
