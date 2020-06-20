import '../support';

describe('Sidenav', () => {
  context('on smaller screens', () => {
    beforeEach(() => {
      cy.viewport('iphone-5');
      cy.bypassAuthGuardAndVisit();
    });

    it('is hidden on smaller screens', () => {
      cy.dataTest('sidenav').should('not.be.visible');
    });

    it('shows/hides when toggle button is clicked', () => {
      cy.dataTest('menu-toggle').click();
      cy.dataTest('sidenav').should('be.visible');
      cy.dataTest('sidenav__header').should('be.visible');

      // we set force to true here because in the UI, the sidenav
      // blocks the menu toggle, we just wanted to make sure that
      // it works
      cy.dataTest('menu-toggle').click({ force: true });
      cy.dataTest('sidenav').should('be.not.visible');
      cy.dataTest('sidenav__header').should('be.not.visible');
    });
  });

  context('on bigger screens', () => {
    beforeEach(() => {
      cy.viewport('ipad-2');
      cy.bypassAuthGuardAndVisit();
    });

    it('is visible on larger screens', () => {
      cy.dataTest('sidenav').should('be.visible');
      cy.dataTest('sidenav__header').should('not.exist');
    });
  });
});
