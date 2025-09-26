/// <reference types="cypress" />

describe('Technology end-to-end flow (no DB reset)', () => {
  it('creates draft -> publishes -> edits base -> reclassifies', () => {
    const uniqueName = `ArgoCD ${Date.now()}`;
    
    cy.visit('/admin/technologies');
    cy.contains('button', 'New').click();
    cy.location('pathname').should('include', '/admin/technologies/new');

    cy.get('#name').type(uniqueName);
    cy.get('#category').select('Tools');
    cy.get('#techDescription').type('GitOps CD for Kubernetes');

    cy.intercept('POST', '/api/technologies').as('createTech');
    cy.contains('button', 'Create').click();
    cy.wait('@createTech').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.location('pathname').should('eq', '/admin/technologies');

    cy.contains('tr', uniqueName).within(() => {
      cy.get('.badge').should('contain.text', 'Draft');
      cy.contains('button', 'Publish').click();
    });

    cy.get('.modal').within(() => {
      cy.get('select').select('Trial');
      cy.get('textarea').type('Initial classification');
      cy.contains('button', 'Publish').click();
    });

    cy.contains('tr', uniqueName).within(() => {
      cy.get('.badge').should('contain.text', 'Published');
      cy.contains('button', 'Edit').click();
    });

    const renamed = `${uniqueName} v2`;
    cy.get('#name').clear().type(renamed);
    cy.contains('button', 'Save').click();

    cy.contains('tr', renamed).within(() => {
      cy.contains('button', 'Change classification').click();
    });

    cy.get('.modal').within(() => {
      cy.get('select').select('Adopt');
      cy.get('textarea').clear().type('Mature and recommended');
      cy.contains('button', 'Save').click();
    });

    cy.contains('tr', renamed).within(() => {
      cy.get('td').eq(2).should('contain.text', 'Adopt');
    });
  });
});
