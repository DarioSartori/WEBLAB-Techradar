describe('Admin Create/Edit Form', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/technologies', (req) => {
      const body = req.body || {};
      if (!body.name || !body.category || !body.techDescription) {
        return req.reply({ statusCode: 400, body: { message: 'Validation error' } });
      }
      req.reply({ id: 'new1', ...body });
    }).as('create');

    cy.intercept('GET', '/api/technologies/e1', {
      id: 'e1',
      name: 'LegacyTool',
      category: 'Tools',
      ring: 'Hold',
      techDescription: 'Old tool',
      ringDescription: 'Avoid for now',
      publishedAt: '2024-05-01'
    }).as('getOne');

    cy.intercept('PATCH', '/api/technologies/e1', (req) => {
      req.reply({ id: 'e1', ...req.body });
    }).as('update');
  });

  it('creates a draft technology (ring optional, description optional)', () => {
    cy.visit('/admin/technologies/new');

    cy.get('input[placeholder="Name"]').type('NewShiny');
    cy.get('select[formcontrolname="category"]').select('Platforms');
    cy.get('textarea[formcontrolname="techDescription"]').type('A shiny new platform');

    cy.get('select[formcontrolname="ring"]').select('Assess');
    cy.get('textarea[formcontrolname="ringDescription"]').type('We will try it in Q4');

    cy.contains('button', 'Save').should('not.be.disabled').click();
    cy.wait('@create');
    cy.location('pathname').should('eq', '/admin/technologies');
  });

  it('edits a published technology (ring + description required)', () => {
    cy.visit('/admin/technologies/e1/edit');
    cy.wait('@getOne');

    cy.get('textarea[formcontrolname="ringDescription"]')
      .invoke('attr', 'placeholder')
      .should('contain', 'required');

    cy.get('select[formcontrolname="ring"]').select('Trial');
    cy.get('textarea[formcontrolname="ringDescription"]').clear().type('Re-evaluating');

    cy.contains('button', 'Save').click();
    cy.wait('@update');
    cy.location('pathname').should('eq', '/admin/technologies');
  });
});
