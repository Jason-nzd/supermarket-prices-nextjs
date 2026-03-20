describe('Milk', () => {
  context('Desktop Resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('/products/milk');
      // Wait for page to fully load
      cy.get('h1').should('be.visible');
      cy.get('nav').should('be.visible');
    });

    it('should display website title, page header, products', () => {
      cy.get('h1').contains('KiwiPrice.xyz');
      // Milk has subcategories, so look for any grid title containing "Milk"
      cy.get('.grid-title').should('be.visible').first().invoke('text').should('match', /Milk/);
      cy.get('.product-card').should('be.visible').should('have.length.greaterThan', 3);
    });

    it('milk product should show title and dollar sign', () => {
      cy.get('.product-card').first().find('div').contains('Milk');
      cy.get('.product-card').first().find('#price').contains('$');
    });
  });
});
