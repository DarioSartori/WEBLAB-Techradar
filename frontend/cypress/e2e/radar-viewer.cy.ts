describe('Radar Viewer', () => {
  it('shows only published technologies, grouped by category and ring', () => {
    cy.intercept('GET', '/api/radar', [
      { id: '1', name: 'ArgoCD', category: 'Tools', ring: 'Trial' },
      { id: '2', name: 'Kubernetes', category: 'Platforms', ring: 'Adopt' },
    ]).as('getRadar');

    cy.visit('/technologies/viewer');
    cy.wait('@getRadar');

    cy.get('[data-cy="category-Tools"]').within(() => {
      cy.get('[data-cy="ring-Trial"] td')
        .eq(1)
        .should('contain.text', 'ArgoCD');
    });

    cy.get('[data-cy="category-Platforms"]').within(() => {
      cy.get('[data-cy="ring-Adopt"] td')
        .eq(1)
        .should('contain.text', 'Kubernetes');
    });
  });
});
