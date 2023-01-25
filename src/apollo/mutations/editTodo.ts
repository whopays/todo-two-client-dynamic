import { gql } from '@apollo/client';

const EDIT_TODO = gql`
  mutation Mutation($todo: TodoInput!, $todoListId: String!) {
    postTodo(todo: $todo, todoListId: $todoListId) {
      id
    }
  }
`;

export default EDIT_TODO;
