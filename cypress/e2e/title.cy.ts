import { todoListTitleId } from '../../src/config';

const idRegexWithHash =
  /^\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const titleEdited = ' edited';

describe('Title', () => {
  it('passes', () => {
    cy.visit('/');
    const initialLocation = cy.location('pathname');
    initialLocation.should('match', idRegexWithHash);

    const newLocation = cy.location('pathname');
    newLocation.then((location) => {
      cy.dataCy(todoListTitleId).should(
        'have.value',
        location.split('/')[1].split('-')[0],
      );
      cy.dataCy(todoListTitleId).type(`${titleEdited}\n`);
      cy.dataCy(todoListTitleId).should(
        'have.value',
        `${location.split('/')[1].split('-')[0]}${titleEdited}`,
      );
    });
  });
});
