import { insertNewElementId, todoInputElementId } from '../../src/config';

const idRegexWithHash =
  /^\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const test = 'test todo';
const testEdited = 'test edited';
const backendUrl = 'http://localhost:4000/';

describe('Events', () => {
  it('new submitted comment appears at the bottom of the list', () => {
    cy.visit('http://localhost:3000/');
    cy.dataCy(insertNewElementId).should('exist');

    const initialLocation = cy.location('pathname');
    initialLocation.should('match', idRegexWithHash);

    cy.url().then((url) => {
      const todoListId = url.split(Cypress.config().baseUrl || '')[1];
      cy.request('POST', backendUrl, {
        operationName: 'Mutation',
        variables: {
          todoListId,
          name: test,
        },
        query: `
            mutation Mutation($name: String!, $todoListId: String!) {
                putTodo(name: $name, todoListId: $todoListId) {
                    id
                    name
                    checked
                    __typename
                }
            }
        `,
      }).then((response) => {
        cy.dataCy(todoInputElementId).eq(0).should('have.value', test);

        const newTodoId = response.body.data.putTodo.id;

        cy.request('POST', backendUrl, {
          operationName: 'Mutation',
          variables: {
            todoListId,
            todo: {
              id: newTodoId,
              name: testEdited,
            },
          },
          query: `
            mutation Mutation($todo: TodoInput!, $todoListId: String!) {
                postTodo(todo: $todo, todoListId: $todoListId) {
                    id
                    __typename
                }
            }
          `,
        }).then(() => {
          cy.dataCy(todoInputElementId).eq(0).should('have.value', testEdited);
        });
      });
    });
  });
});
