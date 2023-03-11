import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable as BeautifulDraggable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { useTheme } from '@mui/material/styles';

import CHANGE_TODO_POSITION from 'src/apollo/mutations/changeTodoPosition';
import todoListContext from 'src/context/todoListContext';
import { Todo, TodoListResponse } from 'src/types/Todo';
import GET_TODOS from 'src/apollo/queries/getTodos';
import { Alert } from '@mui/material';

const getItemStyle = ({
  draggableStyle,
  isDragging,
  opacity,
}: {
  draggableStyle: any;
  isDragging: boolean;
  opacity: number;
}) => ({
  // styles we need to apply on draggables
  ...draggableStyle,
  opacity: isDragging ? 1 - opacity : 'initial',
});

const getListStyle = ({
  isDraggingOver,
  opacity,
}: {
  isDraggingOver: boolean;
  opacity: number;
}): {} => ({
  opacity: isDraggingOver ? 1 - opacity : 'initial',
  width: '100%',
});

function moveArrayItem(
  array: Array<any>,
  fromIndex: number,
  toIndex: number,
): Array<any> {
  const newArray = [...array];
  const item = newArray[fromIndex];
  newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, item);
  return newArray;
}

const Draggable = ({
  items,
}: {
  items: Array<{ component: JSX.Element; id: Todo['id'] }>;
}) => {
  const { palette } = useTheme();
  const [mutateFunction, { error }] = useMutation(CHANGE_TODO_POSITION);
  const { todoListId, todoList, setTodoList } = useContext(todoListContext);

  const onDragEnd: OnDragEndResponder = ({
    draggableId,
    destination,
    source,
  }) => {
    if (!!todoList?.deleted) return;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.index === destination.index) {
      return;
    }

    const newList = {
      id: todoList?.id || '',
      title: todoList?.title || '',
      todos: moveArrayItem(
        todoList?.todos || [],
        source.index,
        destination.index,
      ),
    };

    setTodoList(newList); // update #1: that is for the fastest, almost sync React update

    mutateFunction({
      variables: {
        todoListId: todoListId,
        todoId: draggableId,
        position: destination.index,
      },
      update: (proxy, { data: { changeTodoPosition } }) => {
        // update #3: that is for after apollo receives response
        // update: #4: will come from events, as we're not watching if the same user updated or not
        const data: TodoListResponse | null = proxy.readQuery({
          query: GET_TODOS,
          variables: {
            id: todoListId,
          },
        });

        if (!data) return;

        proxy.writeQuery({
          query: GET_TODOS,
          data: {
            todoList: changeTodoPosition,
          },
          variables: {
            id: todoListId,
          },
        });
      },
      optimisticResponse: {
        // update #2: that is for the quick apollo update
        changeTodoPosition: {
          ...todoList,
          todos: moveArrayItem(
            todoList?.todos || [],
            source.index,
            destination.index,
          ),
        },
      },
    });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle({
                isDraggingOver: snapshot.isDraggingOver,
                opacity: palette.action.selectedOpacity,
              })}
            >
              {items?.map((item, index) => (
                <BeautifulDraggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle({
                        draggableStyle: provided.draggableProps.style,
                        isDragging: snapshot.isDragging,
                        opacity: palette.action.hoverOpacity,
                      })}
                    >
                      {item.component}
                    </div>
                  )}
                </BeautifulDraggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {error && (
        <Alert severity="error">
          {`Not able to update order of the list due to connection issue: ${error}`}
        </Alert>
      )}
    </>
  );
};
export default Draggable;
