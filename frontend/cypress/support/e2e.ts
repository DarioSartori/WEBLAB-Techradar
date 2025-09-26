import './commands';

afterEach(function () {
  if (this.currentTest?.state === 'failed') {
    const name = this.currentTest.fullTitle().replace(/[/\\?%*:|"<>]/g, '_');
    cy.screenshot(`failed-${name}`, { capture: 'runner' });
  }
});
