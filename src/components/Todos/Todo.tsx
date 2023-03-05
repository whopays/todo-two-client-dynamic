import { useState, useContext, useEffect } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { useMutation } from '@apollo/client';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import CircularProgress from '@mui/material/CircularProgress';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Todo as ITodo } from '../../types/Todo';
import GET_TODOS from '../../apollo/queries/getTodos';
import DELETE_TODO from '../../apollo/mutations/deleteTodo';
import EDIT_TODO from '../../apollo/mutations/editTodo';
import todoListContext from '../../context/todoListContext';
import {
  deleteElementId,
  temporaryNewId,
  todoInputElementId,
} from '../../config';
import usePrevious from '../../hooks/usePrevious';

export default function Todo({ name, checked, id }: ITodo) {
  const [innerValue, setInnerValue] = useState(name);
  const { todoListId } = useContext(todoListContext);
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

  const deleteTodo = async () => {
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
        disabled={isUnavailable}
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
                disabled={isUnavailable}
              >
                {checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </IconButton>
            </InputAdornment>
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
      <IconButton
        aria-label="delete"
        data-cy={deleteElementId}
        onClick={async () => {
          if (!(isDeleting || isEditing)) {
            deleteTodo();
          }
        }}
        disabled={isUnavailable}
      >
        {isUnavailable ? (
          <CircularProgress size={24} />
        ) : (
          <DeleteForeverTwoToneIcon />
        )}
      </IconButton>
    </Box>
  );
}
