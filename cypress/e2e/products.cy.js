describe('Milk', () => {
  it('should display product header', () => {
    cy.visit('http://localhost:3000/products/milk');
    cy.get('h1').contains('Milk');
  });
});
