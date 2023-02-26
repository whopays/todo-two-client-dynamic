import ShareIcon from '@mui/icons-material/Share';
import { IconButton } from '@mui/material';

export default function ShareTodoList() {
  return (
    <>
      {!!navigator?.canShare?.({ url: window.location.href }) && (
        <IconButton
          aria-label="share twodo list"
          onClick={async () => {
            try {
              const shareData = {
                title: document.title,
                text: document.title,
                url: window.location.href,
              };
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
