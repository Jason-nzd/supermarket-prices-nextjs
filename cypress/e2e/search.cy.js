describe('Search', () => {
  context('Desktop Resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('/');
      cy.get('h1').should('be.visible');
    });

    it('should allow typing and enter key, then show results', () => {
      cy.get('.search-bar input[name="search"]').should('be.visible');
      cy.get('.search-bar input[name="search"]').type('orange{enter}');
      cy.url().should('include', '/client-search');
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have no mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.hidden');
    });
  });

  context('Client Search Page', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('/client-search?query=orange');
      cy.get('h1').should('be.visible');
    });

    it('should allow re-searching by typing and clicking search button', () => {
      cy.get('.search-bar input[name="search"]')
        .should('be.visible')
        .and('not.be.disabled');
      cy.get('.search-bar input[name="search"]').clear().type('apple');
      cy.get('.search-bar button[type="submit"]').click({ force: true });
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should display search results from URL query param', () => {
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });
  });

  context('iPhone Resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-8');
      cy.visit('/');
    });

    it('should display website title, page header, products', () => {
      cy.get('h1').contains('KiwiPrice.xyz');
      cy.get('.grid-title').contains('Trending Products');
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.visible');
    });
  });
});
