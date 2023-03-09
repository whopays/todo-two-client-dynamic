import { KeyboardEvent, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getPreviousTodoLists, removeTodoList } from './previousTodoList';

export default function PreviousTodoLists() {
  const [previousTodoLists, setPreviousTodoLists] = useState(
    getPreviousTodoLists(),
  );

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = ({ target }: MouseEvent | TouchEvent) => {
    if (anchorRef?.current?.contains(target as Node)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: KeyboardEvent) {
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
            <Box maxWidth={340} overflow="hidden">
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {previousTodoLists.map(
                      ({ id, title }: { id: any; title: string }) => {
                        return (
                          <MenuItem
                            key={id}
                            onClick={() => {
                              window.history.pushState(null, '', `/${id}`);
                              window.location.reload();
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              width="100%"
                            >
                              <Typography
                                textOverflow="ellipsis"
                                overflow="hidden"
                              >
                                {title || '✏️ Missing title'}
                              </Typography>
                              <IconButton
                                aria-label="delete previous list entry"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTodoList(id);
                                  setPreviousTodoLists(getPreviousTodoLists());
                                }}
                              >
                                <DeleteForeverIcon />
                              </IconButton>
                            </Box>
                          </MenuItem>
                        );
                      },
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Box>
          </Grow>
        )}
      </Popper>
    </>
  );
}
