import {
  deleteElementId,
  deleteTodoListId,
  insertNewElementId,
  todoInputElementId,
  confirmTodoListDeleteId,
  loadingTodoId,
} from '../../src/config';

const idRegexWithHash =
  /^\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const test1 = 'test todo';
const test2 = 'test todo 2';
const test2edited = ' edited';

describe('Smoke', () => {
  it('passes', () => {
    cy.visit('/');
    const initialLocation = cy.location('pathname');
    initialLocation.should('match', idRegexWithHash);

    cy.dataCy(insertNewElementId).should('exist');
    cy.dataCy(todoInputElementId).should('not.exist');
    cy.dataCy(insertNewElementId)
      .focus() // https://github.com/cypress-io/cypress/issues/5830#issuecomment-1255597764
      .should('not.be.disabled')
      .type(`${test1}\n`);
    cy.dataCy(loadingTodoId).should('not.exist');
    cy.dataCy(todoInputElementId).eq(0).should('have.value', test1);
    cy.dataCy(insertNewElementId).type(`${test2}\n`);
    cy.dataCy(loadingTodoId).should('not.exist');
    cy.dataCy(todoInputElementId).eq(1).should('have.value', test2);
    cy.dataCy(deleteElementId).eq(0).click();
    cy.dataCy(todoInputElementId).its('length').should('eq', 1);
    cy.dataCy(todoInputElementId).should('have.value', test2);

    cy.reload();
    cy.dataCy(todoInputElementId).its('length').should('eq', 1);
    cy.dataCy(todoInputElementId).should('have.value', test2);

    cy.reload();
    cy.dataCy(todoInputElementId).type(`${test2edited}\n`);
    cy.dataCy(todoInputElementId).should('be.disabled');
    cy.dataCy(loadingTodoId).should('not.exist');
    cy.dataCy(todoInputElementId).should('not.be.disabled');

    cy.reload();
    cy.dataCy(todoInputElementId).should('have.value', test2 + test2edited);

    cy.dataCy(deleteTodoListId).click();
    cy.dataCy(confirmTodoListDeleteId).click();
    cy.dataCy(insertNewElementId).should('exist');
    cy.dataCy(todoInputElementId).should('not.exist');

    const newLocation = cy.location('pathname');
    newLocation.should('match', idRegexWithHash);
  });
});
