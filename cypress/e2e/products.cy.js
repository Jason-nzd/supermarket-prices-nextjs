describe('Milk', () => {
  beforeEach(() => {
    cy.visit('/products/milk');
  });

  it('should display website title, page header, products', () => {
    cy.get('h1').contains('KiwiPrice.xyz');
    cy.get('.grid-title').contains('Milk');
    cy.get('.product-card').should('have.length.greaterThan', 3);
  });

  it('milk product should show title and dollar sign', () => {
    cy.get('.product-card').first().find('div').contains('Milk');
    cy.get('.product-card').first().find('#price').contains('$');
  });
});
