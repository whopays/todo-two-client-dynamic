import {
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@apollo/client';
import todoListContext from 'src/context/todoListContext';
import ADD_TODO from 'src/apollo/mutations/addTodo';
import addNewTodo from 'src/apollo/actions/addNewTodo';

export default function UndoDeleteTodo({
  deletedTextPack,
  setDeletedTextPack,
}: {
  deletedTextPack: Array<string>;
  setDeletedTextPack: Dispatch<SetStateAction<Array<string>>>;
}) {
  const [mutateFunction, { error }] = useMutation(ADD_TODO);
  const { todoListId, todoList } = useContext(todoListContext);
  const [text, setText] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (deletedTextPack.length > 0 && !text) {
      // Set a new snack when we don't have an active one
      setText(deletedTextPack[0]);
      setDeletedTextPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (deletedTextPack.length && text && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [deletedTextPack, text, open, setDeletedTextPack]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleExited = () => {
    setText(undefined);
  };

  const action = (
    <>
      <Button
        disabled={!!todoList?.deleted}
        color="secondary"
        size="small"
        onClick={() => {
          handleClose();
          addNewTodo({ mutateFunction, todoListId, value: text || '' });
        }}
      >
        Restore
      </Button>
      <IconButton
        size="small"
        aria-label="close restore panel"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={6000}
        action={action}
        message={`${text} removed`}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionProps={{ onExited: handleExited }}
      />
      {error && (
        <Alert severity="error">
          {`Not able to restore todo due to error: ${error}`}
        </Alert>
      )}
    </>
  );
}
