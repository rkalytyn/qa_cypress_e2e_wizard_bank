/// <reference types='cypress' />

import { faker } from '@faker-js/faker/locale/uk';
import { getCurrentDate } from '../support/getCurrentDate';

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const secondAccountNumber = '1002';
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const firstBalance = 5096;
  const balance = firstBalance + depositAmount;
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const secondBalance = balance - withdrawAmount;
  const currentDate = getCurrentDate();
  const expectedData = [
    { date: currentDate, amount: withdrawAmount, type: 'Debit' },
    { date: currentDate, amount: depositAmount, type: 'Credit' }
  ];

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.get('#accountSelect').select(accountNumber);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', firstBalance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', secondBalance)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    // hiden
    cy.contains('a', 'Date-Time')
      .should('be.visible')
      .click();

    cy.get('.table tbody tr').each((row, index) => {
      if (expectedData[index]) {
        cy.wrap(row).find('td').eq(0)
          .should('contain.text', expectedData[index].date);
        cy.wrap(row).find('td').eq(1)
          .should('contain.text', expectedData[index].amount);
        cy.wrap(row).find('td').eq(2)
          .should('contain.text', expectedData[index].type);
      }
    });

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select(secondAccountNumber);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', secondAccountNumber)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();

    cy.get('.table tbody tr')
      .should('have.length', 0);

    cy.get('[ng-show="logout"]').click();
    cy.get('#userSelect').should('be.visible');
  });
});
