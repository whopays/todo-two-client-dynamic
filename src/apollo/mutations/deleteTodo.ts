import { gql } from '@apollo/client';

const DELETE_TODO = gql`
  mutation Mutation($todoListId: String!, $todoId: String!) {
    deleteTodo(todoListId: $todoListId, todoId: $todoId)
  }
`;

export default DELETE_TODO;
