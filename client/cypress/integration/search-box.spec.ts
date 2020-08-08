describe('Search box', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuthGuardAndVisit();
    // NOTE: we'll just use simple selectors such as classes here
    cy.dataTest('search-btn').click();
    cy.dataTest('search-box').as('searchBox');
  });
  it('should display a search box when search button is clicked', () => {
    cy.get('@searchBox').should('be.visible');
    cy.get('.search-box__done').should('be.visible');
    cy.get('.search-box__cancel').should('be.visible');

    cy.get('.header__actions').should('not.be.visible');
  });

  it('should close the searchbox when cancel is pressed', () => {
    cy.get('.search-box__cancel').as('cancelButton').should('be.visible');

    cy.get('@cancelButton').click();
    cy.get('@searchBox').should('not.exist');
    cy.get('.header__actions').should('exist');
  });

  it('should autofocus', () => {
    cy.get('.search-box__input').should('be.focused');
  });

  it.skip('should list all matching messages', () => {});
  it.skip('should display a message for no result', () => {});
});
