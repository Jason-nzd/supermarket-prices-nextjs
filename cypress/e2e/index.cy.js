describe('Home Page', () => {
  context('Desktop Resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('/');
    });

    it('should display website title, grid header', () => {
      cy.contains('h1', 'KiwiPrice.xyz');
      cy.contains('.grid-title', 'Trending Products');
    });

    it('should have more than 3 product cards visible', () => {
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have no mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.hidden');
    });

    it('clicking the category menu button should reveal the menu modal', () => {
      cy.get("#category-menu-button").click();
      // cy.task('log', 'Completed deterministic test');
    })
  });

  context('iPhone Resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-8');
      cy.visit('/');
    });

    it('should display website title, grid header', () => {
      cy.contains('h1', 'KiwiPrice.xyz');
      cy.contains('.grid-title', 'Trending Products');
    });

    it('should have more than 3 product cards visible', () => {
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('desktop menu button should be hidden', () => {
      cy.get('#category-menu-button').should('be.hidden');
    });

    it('should have a mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.visible');
    });
  });

});

