type Tech = {
  id: string;
  name: string;
  category: 'Techniques' | 'Platforms' | 'Tools' | 'LanguagesFrameworks';
  ring?: 'Assess' | 'Trial' | 'Adopt' | 'Hold';
  techDescription: string;
  ringDescription?: string;
  publishedAt?: string | null;
};

let draft: Tech[];
let published: Tech[];

const resetData = () => {
  draft = [
    {
      id: 'd1',
      name: 'Astro',
      category: 'LanguagesFrameworks',
      techDescription: 'Astro desc',
      publishedAt: null,
    },
    {
      id: 'd2',
      name: 'Playwright',
      category: 'Tools',
      techDescription: 'Playwright desc',
      publishedAt: null,
    },
  ];

  published = [
    {
      id: 'p1',
      name: 'React',
      category: 'LanguagesFrameworks',
      ring: 'Adopt',
      techDescription: 'React desc',
      ringDescription: 'Adopted',
      publishedAt: '2025-01-01',
    },
  ];
};

describe('Admin List - Publish Draft', () => {
  beforeEach(() => {
    resetData();

    cy.intercept('GET', /\/api\/technologies(\?.*)?/, (req) => {
      const url = new URL(req.url);
      const status = url.searchParams.get('status');
      if (status === 'draft') return req.reply([...draft]);
      if (status === 'published') return req.reply([...published]);
      return req.reply([...draft, ...published]);
    }).as('list');

    cy.intercept('PATCH', /\/api\/technologies\/d1\/publish$/, (req) => {
      const { ring, ringDescription } = req.body || {};
      if (!ring || !ringDescription) {
        return req.reply({ statusCode: 400, body: { message: 'Missing fields' } });
      }

      const idx = draft.findIndex((t) => t.id === 'd1');
      if (idx === -1) return req.reply({ statusCode: 404 });

      const publishedItem: Tech = {
        ...draft[idx],
        ring,
        ringDescription,
        publishedAt: new Date().toISOString(),
      };

      draft.splice(idx, 1);
      published.push(publishedItem);

      return req.reply(publishedItem);
    }).as('publish');
  });

  it('publishes a draft item via dialog (Ring + Descriptions are set)', () => {
    cy.visit('/admin/technologies');
    cy.wait('@list');

    cy.contains('table td', 'Astro').should('be.visible');
    cy.get('.dialog').should('not.exist');

    cy.contains('tr', 'Astro').within(() => {
      cy.contains('button', /Publiz|Publish/i).click({ force: true });
    });

    cy.get('.dialog', { timeout: 12000 }).should('be.visible');

    const reason = 'Looks promising';

    cy.get('.dialog').within(() => {
      cy.contains('label', /^Ring$/i)
        .parent()
        .find('select')
        .should('exist')
        .scrollIntoView()
        .should('not.be.disabled')
        .select('Trial', { force: true });

      cy.contains('label', /^Ring$/i)
        .parent()
        .find('select option:checked')
        .invoke('text')
        .then((t) => t.trim())
        .should('eq', 'Trial');

      cy.contains('label', /Description/i)
        .parent()
        .find('textarea')
        .should('be.visible')
        .scrollIntoView()
        .clear({ force: true })
        .type(reason, { delay: 0, force: true })
        .should('have.value', reason)
        .blur()
        .trigger('change');

      cy.contains('button', 'Publish').click({ force: true });
    });

    cy.wait('@publish')
      .its('request.body')
      .should((body: any) => {
        expect(body).to.have.property('ring', 'Trial');
        expect(body).to.have.property('ringDescription', reason);
      });

    cy.wait('@list');

    cy.contains('button', 'Drafts').click();
    cy.wait('@list');
    cy.contains('table td', 'Astro').should('not.exist');

      cy.contains('button', 'Published').click();
    cy.wait('@list');
    cy.contains('table td', 'Astro').should('exist');
  });
});
