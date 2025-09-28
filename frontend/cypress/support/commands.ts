/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      loginJwt(role?: 'CTO' | 'TECH_LEAD' | 'EMPLOYEE', email?: string): Chainable<void>;
      authRequest<T = any>(options: Partial<Cypress.RequestOptions> & { url: string; method?: string; body?: any }): Chainable<Cypress.Response<T>>;
    }
  }
}

const TOKEN_KEY = 'tr_jwt';
const USER_KEY  = 'tr_user';

Cypress.Commands.add('loginJwt', (role = 'EMPLOYEE', email?: string) => {
  cy.task<string>('jwtSign', { role, email }).then((token) => {
    const e = email || (role === 'EMPLOYEE' ? 'emp@test.local' : 'cto@test.local');
    const user = { id: 'cypress', email: e, role };
    cy.window().then((win) => {
      win.localStorage.setItem(TOKEN_KEY, token);
      win.localStorage.setItem(USER_KEY, JSON.stringify(user));
    });
  });
});

Cypress.Commands.add('authRequest', (options) => {
  return cy.window().then((win) => {
    const token = win.localStorage.getItem(TOKEN_KEY);
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return cy.request({
      method: options.method || 'GET',
      url: options.url,
      body: options.body,
      headers,
      failOnStatusCode: options.failOnStatusCode ?? true,
    });
  });
});

export {};
