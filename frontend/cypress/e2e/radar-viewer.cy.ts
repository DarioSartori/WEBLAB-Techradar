describe('Viewer - shows only published technologies', () => {
  it('grouped by category and ring and renders names in the second column', () => {
    cy.intercept('GET', '**/api/radar*', [
      { id: '1', name: 'ArgoCD',     category: 'Tools',     ring: 'Trial' },
      { id: '2', name: 'Kubernetes', category: 'Platforms', ring: 'Adopt' },
      { id: '3', name: 'Rust',       category: 'LanguagesFrameworks', ring: 'Assess' },
    ]).as('radar');

    cy.visit('/viewer');
    cy.wait('@radar');

    cy.contains('Loading...').should('not.exist');
    cy.get('[data-cy^="category-"]').should('have.length', 4);

    cy.get('[data-cy="category-Tools"]').within(() => {
      cy.get('[data-cy="ring-Trial"] td').eq(1).should('contain.text', 'ArgoCD');
      cy.get('[data-cy="ring-Assess"] td').eq(1).should('contain', '-');
      cy.get('[data-cy="ring-Adopt"]  td').eq(1).should('contain', '-');
      cy.get('[data-cy="ring-Hold"]   td').eq(1).should('contain', '-');
    });

    cy.get('[data-cy="category-Platforms"]').within(() => {
      cy.get('[data-cy="ring-Adopt"] td').eq(1).should('contain.text', 'Kubernetes');
      cy.get('[data-cy="ring-Assess"] td').eq(1).should('contain', '-');
    });

    cy.get('[data-cy="category-LanguagesFrameworks"]').within(() => {
      cy.get('[data-cy="ring-Assess"] td').eq(1).should('contain.text', 'Rust');
      cy.get('[data-cy="ring-Trial"] td').eq(1).should('contain', '-');
    });

    cy.get('[data-cy="category-Techniques"]').within(() => {
      ['Assess','Trial','Adopt','Hold'].forEach(r =>
        cy.get(`[data-cy="ring-${r}"] td`).eq(1).should('contain', '-')
      );
    });
  });
});
