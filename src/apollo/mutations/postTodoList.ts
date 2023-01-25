import { gql } from '@apollo/client';

const POST_TODO_LIST = gql`
  mutation Mutation {
    postTodoList {
      id
      todos {
        id
        checked
        name
      }
      title
    }
  }
`;

export default POST_TODO_LIST;
