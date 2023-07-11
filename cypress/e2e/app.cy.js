describe('NavBar', () => {
  it('should display website header', () => {
    cy.visit('http://localhost:3000/');
    cy.get('h1').contains('KiwiPrice.xyz');
  });
});
