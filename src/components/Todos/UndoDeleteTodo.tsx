import { useContext, Dispatch, SetStateAction } from 'react';
import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@apollo/client';
import todoListContext from 'src/context/todoListContext';
import ADD_TODO from 'src/apollo/mutations/addTodo';
import addNewTodo from 'src/apollo/actions/addNewTodo';

export default function UndoDeleteTodo({
  undoDeletedText,
  setUndoDeletedText,
}: {
  undoDeletedText: string;
  setUndoDeletedText: Dispatch<SetStateAction<string>>;
}) {
  const [mutateFunction, { error }] = useMutation(ADD_TODO);
  const { todoListId } = useContext(todoListContext);

  const action = (
    <>
      <Button
        color="secondary"
        size="small"
        onClick={() => {
          setUndoDeletedText('');
          addNewTodo({ mutateFunction, todoListId, value: undoDeletedText });
        }}
      >
        Undo
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setUndoDeletedText('')}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Snackbar
        open={!!undoDeletedText}
        onClose={() => {
          setUndoDeletedText('');
        }}
        autoHideDuration={6000}
        action={action}
        message={`${undoDeletedText} removed`}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      {error && (
        <Alert severity="error">
          {`Not able to restore todo due to error: ${error}`}
        </Alert>
      )}
    </>
  );
}
