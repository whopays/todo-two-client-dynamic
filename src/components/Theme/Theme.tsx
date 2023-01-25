import { CssBaseline, useMediaQuery, PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useMemo } from 'react';
import colorModeContext from '../../context/colorModeContext';
import ColorModeSwitcher from '../ColorModeSwitcher/ColorModeSwitcher';

function Theme({ children }: { children: JSX.Element | undefined }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light';

  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <ColorModeSwitcher />
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default Theme;
