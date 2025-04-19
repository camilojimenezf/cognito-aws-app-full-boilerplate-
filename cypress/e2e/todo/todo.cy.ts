describe('Todo feature', () => {
  before(() => {
    cy.loginByCognitoApi(Cypress.env('COGNITO_TEST_USER'), Cypress.env('COGNITO_TEST_PASSWORD'));
    cy.clearIndexedDB();
    cy.visit('/todo');
  });

  it('should be able to create a todo, toggle it and delete it', () => {
    cy.testId('todo-form-input').type('Test Todo');
    cy.testId('todo-form-submit').click();

    cy.testId('todo-list').should('contain', 'Test Todo');

    cy.testId('todo-list').should('contain', 'Test Todo');
    cy.testId('todo-item-checkbox').click();
    cy.testId('todo-list').should('contain', 'Test Todo');

    cy.testId('todo-item-delete').click();
    cy.testId('todo-list').should('not.contain', 'Test Todo');
  });
});
