// tslint:disable-next-line: no-namespace
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataTest('greeting')
     */
    dataTest(value: string): Chainable<Element>;
    bypassAuthGuardAndVisit(): void;
  }
}

Cypress.Commands.add('dataTest', attr => {
  cy.get(`[data-test="${attr}"]`);
});

Cypress.Commands.add('bypassAuthGuardAndVisit', () => {
  // mock /api/auth/user to bypass auth guard
  cy.server();
  cy.route('http://localhost:3000/api/auth/user', {
    error: false,
    message: 'Authentication test ok',
    data: {
      user: {
        id: 1,
        displayName: 'test',
        googleId: 'test',
        email: 'test@gmail.com',
        thumbnail: 'test.jpg',
        provider: 'google',
      },
    },
  });
  cy.log('Bypassing auth guard');
  cy.visit('/');
});
