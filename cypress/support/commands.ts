/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import './auth-provider-commands/cognito';

Cypress.Commands.add('testId', (value) => {
  return cy.get(`[test-id="${value}"]`);
});

Cypress.Commands.add('clearIndexedDB', () => {
  cy.window().then((window) => {
    // Delete all databases
    return window.indexedDB.databases().then((databases) => {
      return Promise.all(
        databases.map((database) => {
          return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(database.name as string);
            request.onsuccess = () => resolve(null);
            request.onerror = () => reject(request.error);
          });
        }),
      );
    });
  });
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      loginByCognitoApi(username: string, password: string): Chainable<void>;
      testId(value: string): Chainable<JQuery<HTMLElement>>;
      clearIndexedDB(): Chainable<void>;
    }
  }
}

export {};
