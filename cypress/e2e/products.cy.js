describe('Milk', () => {
  context('Desktop Resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('/products/milk');
      cy.get('h1').should('be.visible');
    });

    it('should display website title, page header, products', () => {
      cy.get('h1').contains('KiwiPrice.xyz');
      // grid-title may contain text directly or an <a> with text inside
      cy.get('.grid-title').should('be.visible').invoke('text').should('include', 'Milk');
      cy.get('.product-card').should('be.visible').should('have.length.greaterThan', 3);
    });

    it('milk product should show title and dollar sign', () => {
      cy.get('.product-card').first().find('div').contains('Milk');
      cy.get('.product-card').first().find('#price').contains('$');
    });
  });
});
