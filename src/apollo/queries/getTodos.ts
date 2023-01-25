import { gql } from '@apollo/client';

const GET_TODOS = gql`
  query TodoList($id: String!) {
    todoList(id: $id) {
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

export default GET_TODOS;
