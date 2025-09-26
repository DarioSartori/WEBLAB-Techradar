/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      apiCreateTechnology(body: {
        name: string;
        category: 'Techniques'|'Platforms'|'Tools'|'LanguagesFrameworks';
        techDescription: string;
        ring?: 'Assess'|'Trial'|'Adopt'|'Hold';
        ringDescription?: string;
      }): Chainable<{ id: string }>;
    }
  }
}

function backendBase() {
  return Cypress.env('BACKEND_URL') || 'http://localhost:3000';
}

Cypress.Commands.add('apiCreateTechnology', (body) => {
  return cy.request('POST', `${backendBase()}/api/technologies`, body).then(r => r.body);
});

export {};
