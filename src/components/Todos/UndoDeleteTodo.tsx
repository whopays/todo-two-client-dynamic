import {
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function UndoDeleteTodo({
  undoDeletedText,
  setUndoDeletedText,
}: {
  undoDeletedText: string;
  setUndoDeletedText: Dispatch<SetStateAction<string>>;
}) {
  const action = (
    <>
      <Button
        color="secondary"
        size="small"
        onClick={() => {
          setUndoDeletedText('');
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
  );
}
