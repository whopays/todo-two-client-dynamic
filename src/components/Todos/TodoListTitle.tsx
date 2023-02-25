import { useMutation } from '@apollo/client';
import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import EDIT_TODO_LIST_TITLE from 'src/apollo/mutations/editTodoListTitle';
import GET_TODOS from 'src/apollo/queries/getTodos';
import { todoListTitleId } from 'src/config';
import todoListContext from 'src/context/todoListContext';
import usePrevious from 'src/hooks/usePrevious';
import { TodoList } from 'src/types/Todo';

export default function TodoListTitle() {
  const { todoListId, todoList } = useContext(todoListContext);
  const [innerValue, setInnerValue] = useState(todoList?.title || '');
  const previousTitle: TodoList['title'] = usePrevious<TodoList['title']>(
    todoList?.title || '',
  );

  const [editFunction, { loading: isEditing, error: editingError }] =
    useMutation(EDIT_TODO_LIST_TITLE);

  useEffect(() => {
    if (innerValue !== todoList?.title && previousTitle !== todoList?.title) {
      setInnerValue(todoList?.title || '');
    }
  }, [innerValue, todoList?.title, previousTitle]);

  const submit = () => {
    editFunction({
      variables: {
        todoListId: todoListId,
        title: innerValue,
      },
      refetchQueries: [GET_TODOS],
    });
  };

  const title = todoList?.title ? `${todoList?.title} | Two do` : 'Two do';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="description" content={title} />
      </Helmet>

      <TextField
        inputProps={{ 'data-cy': todoListTitleId, maxLength: 512 }}
        disabled={isEditing}
        fullWidth
        placeholder="✏️ Title"
        variant="standard"
        value={innerValue}
        onChange={(e) => {
          setInnerValue(e.target.value);
        }}
        onBlur={submit}
        error={!!editingError}
        helperText={
          !!editingError
            ? `Something went wrong, potentially in internet connection; full error: ${editingError}`
            : undefined
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {!!isEditing && <CircularProgress size={24} />}
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}
