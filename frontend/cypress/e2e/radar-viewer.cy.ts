/// <reference types="cypress" />

describe('Viewer - groups by category and ring', () => {
  it('renders categories, rings and technology pills', () => {
    cy.intercept('GET', '**/api/radar*', {
      statusCode: 200,
      body: [
        { id: '1', name: 'ArgoCD',     category: 'Tools',                ring: 'Trial' },
        { id: '2', name: 'Kubernetes', category: 'Platforms',            ring: 'Adopt' },
        { id: '3', name: 'Rust',       category: 'LanguagesFrameworks',  ring: 'Assess' },
      ],
    }).as('radar');

    cy.visit('/viewer');
    cy.wait('@radar');

    cy.contains('h2', 'Technology Radar', { timeout: 8000 }).should('exist');

    cy.get('.card.cat').should('have.length', 4);

    cy.contains('.card.cat .card-header .chip', /^Tools$/)
      .parents('.card.cat')
      .within(() => {
        cy.contains('tbody tr .ring', 'Trial')
          .parents('tr')
          .find('td').eq(1)
          .within(() => cy.get('.pill').contains('ArgoCD').should('exist'));

        ['Assess', 'Adopt', 'Hold'].forEach(r =>
          cy.contains('tbody tr .ring', r)
            .parents('tr')
            .find('td').eq(1)
            .within(() => cy.get('.pill').should('have.length', 0))
        );
      });

    cy.contains('.card.cat .card-header .chip', /^Platforms$/)
      .parents('.card.cat')
      .within(() => {
        cy.contains('tbody tr .ring', 'Adopt')
          .parents('tr')
          .find('td').eq(1)
          .within(() => cy.get('.pill').contains('Kubernetes').should('exist'));
      });

    cy.contains('.card.cat .card-header .chip', /^Languages & Frameworks$/)
      .parents('.card.cat')
      .within(() => {
        cy.contains('tbody tr .ring', 'Assess')
          .parents('tr')
          .find('td').eq(1)
          .within(() => cy.get('.pill').contains('Rust').should('exist'));
      });

    cy.contains('.card.cat .card-header .chip', /^Techniques$/)
      .parents('.card.cat')
      .within(() => {
        ['Assess', 'Trial', 'Adopt', 'Hold'].forEach(r =>
          cy.contains('tbody tr .ring', r)
            .parents('tr')
            .find('td').eq(1)
            .within(() => cy.get('.pill').should('have.length', 0))
        );
      });

    cy.get('.page.viewer, .viewer').should('not.contain.text', 'id:');
  });

  it('shows empty state', () => {
    cy.intercept('GET', '**/api/radar*', { statusCode: 200, body: [] }).as('radar-empty');
    cy.visit('/viewer');
    cy.wait('@radar-empty');

    cy.contains('h2', 'Technology Radar').should('exist');
    cy.get('.empty-state').should('contain.text', 'No technologies yet');
  });
});
