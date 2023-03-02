import { gql } from '@apollo/client';

const CHANGE_TODO_POSITION = gql`
  mutation Mutation($todoId: String!, $todoListId: String!, $position: Int!) {
    changeTodoPosition(
      todoId: $todoId
      todoListId: $todoListId
      position: $position
    ) {
      id
      title
      todos {
        id
        checked
        name
      }
    }
  }
`;

export default CHANGE_TODO_POSITION;
