describe('Home Page', () => {
  context('1080p desktop resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('http://localhost:3000/');
    });

    it('should display website title, page header, products', () => {
      cy.get('h1').contains('KiwiPrice.xyz');
      cy.get('.grid-title').contains('Trending Products');
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have no mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.hidden');
    });
  });

  context('400p mobile resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-8');
      cy.visit('http://localhost:3000/');
    });

    it('should display website title, page header, products', () => {
      cy.get('h1').contains('KiwiPrice.xyz');
      cy.get('.grid-title').contains('Trending Products');
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have no mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.hidden');
    });
  });

  context('600p mobile resolution', () => {
    beforeEach(() => {
      cy.viewport('ipad-mini');
      cy.visit('http://localhost:3000/');
    });

    it('should display website title, page header, products', () => {
      cy.get('h1').contains('KiwiPrice.xyz');
      cy.get('.grid-title').contains('Trending Products');
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.visible');
    });

    it('search button should popup input field and allow typing', () => {
      cy.get('#mobile-search-button').click();
      cy.get('#search').should('be.visible');
      cy.get('#search').type('orange');
    });
  });
});
