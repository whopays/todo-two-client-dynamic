import { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { TodoList } from '../../types/Todo';
import DELETE_TODO_LIST from '../../apollo/mutations/deleteTodoList';
import { useMutation } from '@apollo/client';
import { confirmTodoListDeleteId, deleteTodoListId } from '../../config';
import { IconButton } from '@mui/material';
import todoListContext from '../../context/todoListContext';
import { removeTodoList } from '../PreviousTodoLists/previousTodoList';

export default function DeleteTodoList({ id }: { id: TodoList['id'] }) {
  const [open, setOpen] = useState(false);
  const { todoList } = useContext(todoListContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [deleteTodoListFunction, { loading, error }] =
    useMutation(DELETE_TODO_LIST);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button
            disabled={!!todoList?.deleted}
            color="inherit"
            size="small"
            onClick={async () => {
              const { data } = await deleteTodoListFunction({
                variables: {
                  todoListId: id,
                },
              });

              if (data?.deleteTodoList || data?.deleteTodoList === null) {
                window.history.pushState(null, '', '/');
                window.location.reload();
              }
            }}
          >
            Try to delete again
          </Button>
        }
      >
        {`Not able to delete the list due to connection issue: ${error}`}
      </Alert>
    );

  return (
    <>
      {!loading && !!todoList?.todos?.length && todoList?.todos?.length > 0 && (
        <IconButton
          aria-label="delete"
          data-cy={deleteTodoListId}
          onClick={handleClickOpen}
          disabled={loading || !!todoList?.deleted}
        >
          <DeleteForeverIcon />
        </IconButton>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete the list?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you click 'Confirm delete', the list will be permanently
            deleted. You will be redirected to a new, empty list. Deletion can't
            be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go back without deletion</Button>
          <Button
            disabled={!!todoList?.deleted}
            onClick={async () => {
              handleClose();
              const { data } = await deleteTodoListFunction({
                variables: {
                  todoListId: id,
                },
              });

              if (data?.deleteTodoList || data?.deleteTodoList === null) {
                if (todoList) {
                  removeTodoList(todoList.id);
                }

                window.history.pushState(null, '', '/');
                window.location.reload();
              }
            }}
            autoFocus
            data-cy={confirmTodoListDeleteId}
          >
            Confirm delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
