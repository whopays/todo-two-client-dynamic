import Box from '@mui/material/Box';

import Theme from '../Theme/Theme';
import Todos from '../Todos/Todos';
import ColorModeSwitcher from '../ColorModeSwitcher/ColorModeSwitcher';
// import PreviousTodoLists from '../PreviousTodoLists/PreviousTodoLists';

function App() {
  return (
    <Theme>
      <>
        <Todos />
        <Box
          sx={{
            width: '20rem',
            margin: '0 auto',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* <PreviousTodoLists /> */}
          <ColorModeSwitcher />
        </Box>
      </>
    </Theme>
  );
}

export default App;
