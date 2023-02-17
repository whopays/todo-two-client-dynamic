import HistoryIcon from '@mui/icons-material/History';
import { IconButton } from '@mui/material';

function PreviousTodoLists() {
  return (
    <IconButton
      aria-label="previos todo lists"
      onClick={() => {}}
      edge="start"
      //   disabled={isUnavailable}
    >
      <HistoryIcon />
    </IconButton>
  );
}

export default PreviousTodoLists;
