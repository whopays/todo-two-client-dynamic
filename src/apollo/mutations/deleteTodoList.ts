import { gql } from '@apollo/client';

const DELETE_TODO_LIST = gql`
  mutation deleteTodoList($todoListId: String!) {
    deleteTodoList(todoListId: $todoListId)
  }
`;

export default DELETE_TODO_LIST;
