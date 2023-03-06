import { CircularProgress, IconButton } from '@mui/material';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { deleteElementId } from 'src/config';

export default function DeleteTodo({
  isUnavailable,
  deleteTodo,
}: {
  isUnavailable: boolean;
  deleteTodo: () => void;
}) {
  return (
    <IconButton
      aria-label="delete"
      data-cy={deleteElementId}
      onClick={async () => {
        if (!isUnavailable) {
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
  );
}
