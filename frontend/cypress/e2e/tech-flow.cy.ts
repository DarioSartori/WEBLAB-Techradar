describe('Technology end-to-end flow', () => {
  beforeEach(() => {
    cy.loginJwt('CTO');

    cy.intercept('GET', '**/api/technologies*').as('list');
    cy.intercept('POST', '**/api/technologies').as('createTech');
    cy.intercept('PATCH', '**/api/technologies/*/publish').as('publishTech');
    cy.intercept('PATCH', '**/api/technologies/*').as('updateTech');
    cy.intercept('PATCH', '**/api/technologies/*/reclassify').as('reclassifyTech');
  });

  it('creates draft -> publishes -> edits base -> reclassifies', () => {
    const baseName = `ArgoCD-${Date.now()}`;

    cy.visit('/admin/technologies');
    cy.wait('@list');
    cy.contains('button', /^New$/).click();
    cy.url().should('include', '/admin/technologies/new');

    cy.get('#name').type(baseName);
    cy.get('#category').select('Tools');
    cy.get('#techDescription').type('GitOps CD for Kubernetes');

    cy.get('form').should('exist').within(() => {
      cy.get('button[type="submit"]').should('be.visible').click();
    });
    cy.wait('@createTech').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.url().should('include', '/admin/technologies');
    cy.wait('@list');
    cy.contains('tr', baseName).within(() => {
      cy.get('.badge.draft').should('exist');
      cy.contains('button', /^Publish$/).click();
    });

    cy.get('.modal').should('be.visible');
    cy.get('.modal select').select('Trial');
    cy.get('.modal textarea').type('Try in selected teams');
    cy.get('.modal .btn.btn-primary').click();
    cy.wait('@publishTech').its('response.statusCode').should('eq', 200);

    cy.contains('tr', baseName).within(() => {
      cy.get('.badge.published').should('exist');
      cy.contains('button', /^Edit$/).click();
    });

    cy.url().should('match', /\/admin\/technologies\/.+\/edit$/);
    cy.get('#techDescription').clear().type('Updated description');

    cy.get('form').within(() => {
      cy.get('button[type="submit"]').should('be.visible').click();
    });
    cy.wait('@updateTech').its('response.statusCode').should('be.oneOf', [200, 204]);

    cy.url().should('include', '/admin/technologies');
    cy.wait('@list');
    cy.contains('tr', baseName).within(() => {
      cy.contains('button', /^Change classification$/).click();
    });
    cy.get('.modal').should('be.visible');
    cy.get('.modal select').select('Adopt');
    cy.get('.modal textarea').clear().type('We adopt this now');
    cy.get('.modal .btn.btn-primary').click();
    cy.wait('@reclassifyTech').its('response.statusCode').should('eq', 200);
  });
});
