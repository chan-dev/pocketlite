// tslint:disable-next-line: no-namespace
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataTest('greeting')
     */
    dataTest(value: string): Chainable<Element>;
  }
}

Cypress.Commands.add('dataTest', attr => {
  cy.get(`[data-test="${attr}"]`);
});
