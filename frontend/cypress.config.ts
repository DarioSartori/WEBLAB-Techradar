import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      const jwt = require('jsonwebtoken');
      on('task', {
        jwtSign({ role, email, secret }) {
          const s = secret || process.env['JWT_SECRET'] || 'dev-secret';
          const e =
            email ||
            (role === 'EMPLOYEE' ? 'emp@test.local' : 'cto@test.local');
          const token = jwt.sign({ sub: 'cypress', email: e, role }, s, {
            expiresIn: '1h',
          });
          return token;
        },
      });

      config.env['JWT_SECRET'] =
        config.env['JWT_SECRET'] || process.env['JWT_SECRET'] || 'dev-secret';
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    screenshotOnRunFailure: true,
    env: {
      BACKEND_URL: 'http://localhost:3000',
      JWT_SECRET: 'dev-secret',
    },
  },
  viewportWidth: 1280,
  viewportHeight: 800,
});
