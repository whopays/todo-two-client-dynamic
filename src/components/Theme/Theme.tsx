import { CssBaseline, useMediaQuery, PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useMemo, type JSX } from 'react';
import colorModeContext from '../../context/colorModeContext';

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
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default Theme;
