describe('Tags', () => {
  beforeEach(() => {
    cy.viewport('ipad-2');
    cy.server();
    cy.route('/api/tags', 'fixture:tags');
    cy.visit('/');
    cy.get('[data-test="tags-menu-button"]').click();
  });

  it('shows the tag view', () => {
    cy.get('[data-test="sidenav-parent-view"]').should('not.exist');
    cy.get('[data-test="sidenav-child-view"]').should('exist');
  });

  it('shows all available tags', () => {
    // TODO:
    cy.fixture('tags').then(tags => {
      cy.get('[data-test="tags-list"]').as('tags-list');

      cy.get('@tags-list')
        .find('li')
        .each(($li, i) => {
          cy.wrap($li).should('contain.text', tags[i].name);
        });

      cy.get('@tags-list').should('exist').find('li').should('have.length', 3);
    });
  });

  it('shows tag edit view on click', () => {
    cy.get('[data-test="tags-list"]')
      .find('[data-test="tag-show-view"]')
      .first()
      .find('[data-test="tag-edit-button"]')
      .invoke('show')
      .click();

    cy.get('[data-test="tag-edit-view"]').should('be.visible');
  });

  it('shows only 1 tag edit view at a time', () => {
    cy.get('[data-test="tags-list"]')
      .find('[data-test="tag-show-view"]')
      .each(($el, i) => {
        cy.wrap($el)
          .find('[data-test="tag-edit-button"]')
          .invoke('show')
          .click();
      });

    // we're using [hidden] instead of *ngIf directive so
    // we have to filter only the visible ones
    cy.get('[data-test="tag-edit-view"]:visible').should('have.length', 1);
  });

  it('autofocus the input when tag edit view is shown', () => {
    cy.get('[data-test="tags-list"]')
      .find('[data-test="tag-show-view"]')
      .each(($el, i) => {
        cy.wrap($el)
          .find('[data-test="tag-edit-button"]')
          .invoke('show')
          .click();
        cy.get('[data-test="tag-edit-view"] input').should('be.focused');
      });
  });
});
