describe('Search', () => {
  context('1080p desktop resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('/');
    });

    it('search should allow typing and enter key, then show results', () => {
      cy.get('#search').should('be.visible');
      cy.get('#search').click();
      cy.get('#search').should('be.focused');
      cy.get('#search').type('orange{enter}');
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('search should allow typing and button click, then show results', () => {
      cy.get('#search').should('be.visible');
      cy.get('#search').click();
      cy.get('#search').type('orange');
      cy.get('#search-button').click({ force: true });
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have no mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.hidden');
    });
  });

  context('400p small mobile resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-8');
      cy.visit('/');
    });

    it('should display website title, page header, products', () => {
      cy.get('h1').contains('KiwiPrice.xyz');
      cy.get('.grid-title').contains('Trending Products');
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    // it('should have no mobile search button on nav bar', () => {
    //   cy.get('#mobile-search-button').should('be.hidden');
    // });
  });
});
