import { useContext } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import colorModeContext from '../../context/colorModeContext';

function ColorModeSwitcher() {
  const theme = useTheme();
  const { toggleColorMode } = useContext(colorModeContext);

  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={toggleColorMode}
      color="inherit"
      aria-label="switch color palette"
    >
      {theme.palette.mode === 'dark' ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
}

export default ColorModeSwitcher;
