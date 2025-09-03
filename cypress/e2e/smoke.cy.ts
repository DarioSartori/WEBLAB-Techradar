describe('App loads', () => {
  it('should show the Angular app root', () => {
    cy.visit('/');
    cy.contains('app works').should('exist'); // passe an deine Startseite an
  });
});