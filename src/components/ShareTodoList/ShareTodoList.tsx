import ShareIcon from '@mui/icons-material/Share';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import todoListContext from 'src/context/todoListContext';

export default function ShareTodoList() {
  const { todoList } = useContext(todoListContext);
  const shareData = {
    title: todoList?.title || 'Two do',
    text: todoList?.title || 'Two do',
    url: window.location.href,
  };

  return (
    <>
      {!!navigator?.canShare?.(shareData) && (
        <IconButton
          aria-label="share twodo list"
          onClick={async () => {
            try {
              await navigator.share(shareData);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <ShareIcon />
        </IconButton>
      )}
    </>
  );
}
