describe('login', () => {
  it("should be redirected to /auth by default when user doesn't have a session", () => {
    cy.visit('/');
    cy.url().should('include', '/auth');
  });

  it('should be able to login with cognito', () => {
    cy.visit('/');
    cy.url().should('include', '/auth');
    cy.loginByCognitoApi(Cypress.env('COGNITO_TEST_USER'), Cypress.env('COGNITO_TEST_PASSWORD'));
    cy.reload();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.url().should('not.include', '/auth');
  });
});
