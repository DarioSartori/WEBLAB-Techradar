describe('Create technology', () => {
  it('deactivates button until all mandatory fields are valid and sends POST', () => {
    cy.visit('/technologies/create');

    // Button disabled
    cy.contains('button', 'Save').should('be.disabled');

    cy.get('input[formcontrolname="name"]').type('ArgoCD');
    cy.get('select[formcontrolname="category"]').select('Tools');
    cy.get('select[formcontrolname="ring"]').select('Trial');
    cy.get('textarea[formcontrolname="techDescription"]').type('Argo CD is declarative...');
    cy.get('textarea[formcontrolname="ringDescription"]').type('Without making a judgment...');

    // Jetzt enabled
    cy.contains('button', 'Save').should('not.be.disabled');

    // Request abfangen und prüfen
    cy.intercept('POST', '/api/technologies', (req) => {
      expect(req.body).to.include({
        name: 'ArgoCD',
        category: 'Tools',
        ring: 'Trial',
      });
      req.reply({ statusCode: 201, body: { id: 'uuid', createdAt: new Date().toISOString() } });
    }).as('createTech');

    cy.contains('button', 'Save').click();
    cy.wait('@createTech').its('response.statusCode').should('eq', 201);
  });
});
