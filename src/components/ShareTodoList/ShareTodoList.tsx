import ShareIcon from '@mui/icons-material/Share';
import { IconButton } from '@mui/material';

export default function ShareTodoList() {
  const shareData = {
    title: 'Two do',
    text: document.title,
    url: window.location.href,
  };

  return (
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
  );
}
