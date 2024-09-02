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
declare namespace Cypress {
    interface Chainable {
        testAdd: any;
        testExist: any;
    }
}

Cypress.Commands.add('testAdd', (token: any, item: any) => {
    cy.get(token).contains(item).click();
  })

Cypress.Commands.add('testExist', (obj: any, item: any) => {
    cy.get(obj)
    .contains(item)
    .should('exist');
})