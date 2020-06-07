describe('Sidenav', () => {
  context('on smaller screens', () => {
    beforeEach(() => {
      cy.viewport('iphone-5');
      cy.visit('/');
    });

    it('is hidden on smaller screens', () => {
      cy.get('[data-test="sidenav"]').should('not.be.visible');
    });

    it('shows/hides when toggle button is clicked', () => {
      cy.get('[data-test="menu-toggle"]').click();
      cy.get('[data-test="sidenav"]').should('be.visible');
      cy.get('[data-test="sidenav__header"]').should('be.visible');

      // we set force to true here because in the UI, the sidenav
      // blocks the menu toggle, we just wanted to make sure that
      // it works
      cy.get('[data-test="menu-toggle"]').click({ force: true });
      cy.get('[data-test="sidenav"]').should('be.not.visible');
      cy.get('[data-test="sidenav__header"]').should('be.not.visible');
    });
  });

  context('on bigger screens', () => {
    beforeEach(() => {
      cy.viewport('ipad-2');
      cy.visit('/');
    });

    it('is visible on larger screens', () => {
      cy.get('[data-test="sidenav"]').should('be.visible');
      cy.get('[data-test="sidenav__header"]').should('not.exist');
    });
  });
});
