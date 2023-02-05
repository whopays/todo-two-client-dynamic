import { useMutation } from '@apollo/client';
import { TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import EDIT_TODO_LIST_TITLE from 'src/apollo/mutations/editTodoListTitle';
import GET_TODOS from 'src/apollo/queries/getTodos';
import { todoListTitleId } from 'src/config';
import todoListContext from 'src/context/todoListContext';
import usePrevious from 'src/hooks/usePrevious';
import { TodoList } from 'src/types/Todo';

export default function TodoListTitle() {
  const { todoListId, todoList } = useContext(todoListContext);
  const [innerValue, setInnerValue] = useState(todoList?.title);
  const previousTitle: TodoList['title'] = usePrevious<TodoList['title']>(
    todoList?.title || '',
  );

  const [editFunction, { loading: isEditing, error: editingError }] =
    useMutation(EDIT_TODO_LIST_TITLE);

  useEffect(() => {
    if (todoList?.title) {
      document.title = `${todoList?.title} | Two do`;
    }
  }, [todoList?.title]);

  useEffect(() => {
    if (innerValue !== todoList?.title && previousTitle !== todoList?.title) {
      setInnerValue(todoList?.title);
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

  return (
    <TextField
      inputProps={{ 'data-cy': todoListTitleId, maxLength: 512 }}
      fullWidth
      placeholder="✏️ title"
      variant="standard"
      value={innerValue}
      onChange={(e) => {
        setInnerValue(e.target.value);
      }}
      onBlur={submit}
    />
  );
}
