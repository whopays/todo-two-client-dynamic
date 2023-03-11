import { CircularProgress, IconButton } from '@mui/material';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { deleteElementId } from 'src/config';
import { useContext } from 'react';
import todoListContext from 'src/context/todoListContext';

export default function DeleteTodo({
  isUnavailable,
  deleteTodo,
}: {
  isUnavailable: boolean;
  deleteTodo: () => void;
}) {
  const { todoList } = useContext(todoListContext);

  return (
    <IconButton
      aria-label="delete"
      data-cy={deleteElementId}
      onClick={async () => {
        if (!isUnavailable) {
          deleteTodo();
        }
      }}
      disabled={isUnavailable || !!todoList?.deleted}
    >
      {isUnavailable ? (
        <CircularProgress size={24} />
      ) : (
        <DeleteForeverTwoToneIcon />
      )}
    </IconButton>
  );
}
