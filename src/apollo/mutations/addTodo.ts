import { gql } from '@apollo/client';

const ADD_TODO = gql`
  mutation Mutation($name: String!, $todoListId: String!) {
    putTodo(name: $name, todoListId: $todoListId) {
      id
      name
      checked
    }
  }
`;

export default ADD_TODO;
