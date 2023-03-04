import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable as BeautifulDraggable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { grey } from '@mui/material/colors';
import CHANGE_TODO_POSITION from 'src/apollo/mutations/changeTodoPosition';
import todoListContext from 'src/context/todoListContext';
import { Todo } from 'src/types/Todo';

const getItemStyle = (draggableStyle: any, isDragging: boolean): {} => ({
  // styles we need to apply on draggables
  ...draggableStyle,
  background: isDragging ? grey[700] : 'initial',
});

const getListStyle = (isDraggingOver: boolean): {} => ({
  background: isDraggingOver ? grey[900] : 'initial',
  width: '100%',
});

const Draggable = ({
  items,
}: {
  items: Array<{ component: JSX.Element; id: Todo['id'] }>;
}) => {
  const [mutateFunction, { error }] = useMutation(CHANGE_TODO_POSITION);
  const { todoListId } = useContext(todoListContext);

  const onDragEnd: OnDragEndResponder = ({
    draggableId,
    destination,
    source,
  }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.index === destination.index) {
      return;
    }

    mutateFunction({
      variables: {
        todoListId: todoListId,
        todoId: draggableId,
        position: destination.index,
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
              style={getListStyle(snapshot.isDraggingOver)}
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
                      style={getItemStyle(
                        provided.draggableProps.style,
                        snapshot.isDragging,
                      )}
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
      {error}
    </>
  );
};
export default Draggable;
