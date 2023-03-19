import {
  insertNewElementId,
  loadingTodoId,
  previousTodoListDeleteItemId,
  previousTodoListDropdownItemId,
  previousTodoListsId,
  todoInputElementId,
} from 'src/config';

const idRegexWithHash =
  /^\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('Previous Todo Lists', () => {
  it('passes', () => {
    const testStringFirst = 'Todo in first List';
    const testStringSecond = 'Todo in second List';
    cy.visit('/');

    const initialLocation = cy.location('pathname');
    initialLocation.should('match', idRegexWithHash);

    cy.dataCy(previousTodoListsId).should('not.exist');
    cy.dataCy(insertNewElementId)
      .focus() // https://github.com/cypress-io/cypress/issues/5830#issuecomment-1255597764
      .should('not.be.disabled')
      .type(`${testStringFirst}\n`);
    cy.dataCy(todoInputElementId).eq(0).should('have.value', testStringFirst);
    cy.dataCy(loadingTodoId).should('not.exist');

    cy.visit('/');
    const newLocation = cy.location('pathname');
    newLocation.should('match', idRegexWithHash);
    cy.dataCy(previousTodoListsId).should('exist');
    cy.dataCy(insertNewElementId)
      .focus() // https://github.com/cypress-io/cypress/issues/5830#issuecomment-1255597764
      .should('not.be.disabled')
      .type(`${testStringSecond}\n`);
    cy.dataCy(todoInputElementId).eq(0).should('have.value', testStringSecond);
    cy.dataCy(loadingTodoId).should('not.exist');

    cy.dataCy(previousTodoListsId).click();
    cy.dataCy(previousTodoListDropdownItemId).click();
    cy.dataCy(todoInputElementId).eq(0).should('have.value', testStringFirst);

    cy.dataCy(previousTodoListsId).click();
    cy.dataCy(previousTodoListDropdownItemId).eq(1).click();
    cy.dataCy(todoInputElementId).eq(0).should('have.value', testStringSecond);

    cy.dataCy(previousTodoListsId).click();
    cy.dataCy(previousTodoListDeleteItemId).eq(0).click();
    cy.dataCy(previousTodoListDeleteItemId).eq(0).click();
    cy.dataCy(previousTodoListsId).should('not.exist');
  });
});
