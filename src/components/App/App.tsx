import Box from '@mui/material/Box';

import TodoListContext from '../../context/todoListContext';
import Theme from '../Theme/Theme';
import Todos from '../Todos/Todos';
import ColorModeSwitcher from '../ColorModeSwitcher/ColorModeSwitcher';
import PreviousTodoLists from '../PreviousTodoLists/PreviousTodoLists';
import ShareTodoList from '../ShareTodoList/ShareTodoList';
import { useState } from 'react';
import { TodoList } from 'src/types/Todo';
import DeleteTodoList from '../Todos/DeleteTodoList';

function App() {
  const [todoList, setTodoList] = useState<TodoList>();
  const [todoListId, setTodoListId] = useState<string>(
    window.location.pathname.split('/')[1],
  );

  return (
    <Theme>
      <TodoListContext.Provider
        value={{
          todoListId,
          setTodoListId,
          todoList,
          setTodoList,
        }}
      >
        <Todos />
        <Box
          sx={{
            width: '20rem',
            margin: '0 auto',
            paddingTop: '3rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <PreviousTodoLists />
          <ShareTodoList />
          {todoListId && <DeleteTodoList id={todoListId} />}
          <ColorModeSwitcher />
        </Box>
      </TodoListContext.Provider>
    </Theme>
  );
}

export default App;
