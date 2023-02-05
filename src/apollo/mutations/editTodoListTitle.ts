import { gql } from '@apollo/client';

const EDIT_TODO_LIST_TITLE = gql`
  mutation Mutation($title: String!, $todoListId: String!) {
    putTodoListTitle(title: $title, todoListId: $todoListId)
  }
`;

export default EDIT_TODO_LIST_TITLE;
