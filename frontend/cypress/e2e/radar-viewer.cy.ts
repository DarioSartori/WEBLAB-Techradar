describe('Viewer - groups by category and ring (new markup)', () => {
  beforeEach(() => {
    cy.loginJwt('EMPLOYEE');

    cy.intercept('GET', '**/api/radar*', [
      { id: '1', name: 'ArgoCD',     category: 'Tools',                 ring: 'Trial'  },
      { id: '2', name: 'Kubernetes', category: 'Platforms',             ring: 'Adopt'  },
      { id: '3', name: 'Rust',       category: 'LanguagesFrameworks',   ring: 'Assess' },
    ]).as('radar');
  });

  it('renders categories, rings and technology pills', () => {
    cy.visit('/viewer');
    cy.wait('@radar');

    cy.contains('h2', 'Technology Radar').should('be.visible');

    cy.get('section.card.cat').should('have.length', 4);
    cy.contains('.card-header .chip', /^Tools$/).parents('section.card.cat').within(() => {
      cy.contains('tbody tr', /\bTrial\b/).within(() => {
        cy.get('.pill-list .pill').should('contain.text', 'ArgoCD');
      });
    });

    cy.contains('.card-header .chip', /^Platforms$/).parents('section.card.cat').within(() => {
      cy.contains('tbody tr', /\bAdopt\b/).within(() => {
        cy.get('.pill-list .pill').should('contain.text', 'Kubernetes');
      });
    });

    cy.contains('.card-header .chip', /^Languages & Frameworks$/).parents('section.card.cat').within(() => {
      cy.contains('tbody tr', /\bAssess\b/).within(() => {
        cy.get('.pill-list .pill').should('contain.text', 'Rust');
      });
    });
  });
});
