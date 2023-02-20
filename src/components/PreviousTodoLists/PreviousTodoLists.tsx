import { useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import HistoryIcon from '@mui/icons-material/History';

export default function PreviousTodoLists() {
  localStorage.setItem(
    'previousTodoLists',
    JSON.stringify([
      {
        id: 'ad60cc5c-b64d-4b40-803e-cff7710852ee',
        title: '',
      },
      {
        id: 'ad60cc5c-b64d-4b40-803e-cff7710852ee',
        title: 'Feb 20, 2023 (ad60cc5c)',
      },
      {
        id: 'ad60cc5c-b64d-4b40-803e-cff7710852ee',
        title:
          'Feb 20, 2023 (ad60cc5c) 123123l,123l;,13l;1,23 ;l12,3l;1 2,3;l12,3;l1',
      },
    ]),
  );

  const previousTodoLists = JSON.parse(
    localStorage.getItem('previousTodoLists') || '{}',
  );

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // @ts-ignore
  const handleClose = (event) => {
    // @ts-ignore
    if (anchorRef.current && anchorRef.current?.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // @ts-ignore
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <HistoryIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {previousTodoLists.map(
                    (previousTodoList: { id: any; title: string }) => {
                      return (
                        <MenuItem
                          key={previousTodoList.id}
                          onClick={() => {
                            window.history.pushState(
                              null,
                              '',
                              `/${previousTodoList.id}`,
                            );
                            window.location.reload();
                          }}
                        >
                          {previousTodoList.title || '✏️ Empty'}
                        </MenuItem>
                      );
                    },
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
