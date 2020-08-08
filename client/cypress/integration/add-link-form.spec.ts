describe('AddLinkForm', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuthGuardAndVisit();
    // NOTE: we'll just use simple selectors such as classes here
    cy.dataTest('add-link-btn').click();
    cy.dataTest('add-link-form').as('addLinkForm');
  });
  it('should display add link from when add link button is clicked', () => {
    cy.get('@addLinkForm').should('be.visible');
    cy.get('.add-link-form__done').should('be.visible');
    cy.get('.add-link-form__cancel').should('be.visible');
    cy.get('.header__actions').should('not.be.visible');
  });

  it('should close the add link form when cancel is pressed', () => {
    cy.get('.add-link-form__done').should('be.visible');
    cy.get('.add-link-form__cancel').as('cancelButton').should('be.visible');

    cy.get('@cancelButton').click();
    cy.get('@addLinkForm').should('not.exist');
  });

  it('should autofocus', () => {
    cy.get('.add-link-form__input').should('be.focused');
  });
});
