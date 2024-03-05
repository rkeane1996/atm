import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Money } from '../data/enums/money.enum';
import { AtmFundRepository } from '../repositories/atm-fund.repository';
import { TransactionDto } from 'src/transaction/dtos/transaction.dto';
import { TransactionService } from 'src/transaction/service/transaction.service';
import { WithdrawMoneyRequestDto } from 'src/atm/dtos/withdraw-request.dto';
import { AccountService } from 'src/account/service/account.service';
import { TransactionType } from 'src/transaction/dtos/constants/transaction-type';
import { TransactionStatus } from '../data/enums/transactionStatus.enum';
import { WithdrawMoneyResponseDto } from 'src/atm/dtos/withdraw-money.response';
import { LodgeMoneyRequestDto } from 'src/atm/dtos/lodgement-request.dto';

@Injectable()
export class AtmService {
  constructor(
    private readonly atmFundRepo: AtmFundRepository,
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService
  ) { }

  async performWithdrawRequest(request: WithdrawMoneyRequestDto) {
    this.checkATMFunds(request.amount);
    const account = await this.accountService.getAccount(request.accounNumber);
    let transaction = await this.transactionService.createTransaction({
      userId: account.accountNumber,
      transactionAmount: request.amount,
      transactionType: TransactionType.WITHDRAWAL,
      notes: new Map<Money, number>(),
      status: TransactionStatus.PENDING,
    });
    try {
      await this.withdrawMoniesFromAtmFund(request.amount, transaction);
    } catch (error) {
      await this.transactionService.updateTransactionStatus(transaction, TransactionStatus.FAILED_BANK_UPDATE);
      return error;
    }
    try {
      await this.accountService.creditAccountBalance(request.amount, account);
    } catch (error) {
      await this.transactionService.updateTransactionStatus(transaction, TransactionStatus.FAILED_USER_UPDATE);
      return error;
    }
    await this.transactionService.updateTransactionStatus(transaction, TransactionStatus.COMPLETE);
    return new WithdrawMoneyResponseDto(transaction.notes);
  }

  async performLodgementRequest(request: LodgeMoneyRequestDto) {
    const account = await this.accountService.getAccount(request.accounNumber);
    let transaction = await this.transactionService.createTransaction({
      userId: account.accountNumber,
      transactionAmount: request.lodgementAmount,
      transactionType: TransactionType.LODGEMENT,
      notes: new Map<Money, number>(),
      status: TransactionStatus.PENDING,
    });

    try {
      await this.lodgeMoniesToAtmFund(request.lodgementAmount, request.notes);
    } catch (error) {
      await this.transactionService.updateTransactionStatus(transaction, TransactionStatus.FAILED_BANK_UPDATE);
      return error;
    }
    try {
      await this.accountService.debitAccountBalance(request.lodgementAmount, account);
    } catch (error) {
      await this.transactionService.updateTransactionStatus(transaction, TransactionStatus.FAILED_USER_UPDATE);
      return error;
    }
    await this.transactionService.updateTransactionStatus(transaction, TransactionStatus.COMPLETE);
    return new WithdrawMoneyResponseDto(transaction.notes);
  }

  async withdrawMoniesFromAtmFund(amount: number, transaction: TransactionDto) {
    let numOfFiftyNotesToDispense = 1;
    let numOfTwentyNotesToDispense = 1;
    let numOfTenNotesToDispense = 1;
    let numOfFiveNotesToDispense = 1;
    let bankFunds = await this.atmFundRepo.getFunds();

    do {
      if (
        amount >= Money.FIFTY_EURO_NOTES &&
        bankFunds.numFiftyEuroNotes != 0
      ) {
        bankFunds.numFiftyEuroNotes--;
        bankFunds.totalFunds -= Money.FIFTY_EURO_NOTES;
        amount -= Money.FIFTY_EURO_NOTES;
        transaction.notes.set(Money.FIFTY_EURO_NOTES, numOfFiftyNotesToDispense++);
      } else if (
        amount >= Money.TWENTY_EURO_NOTES &&
        bankFunds.numTwentyEuroNotes != 0
      ) {
        bankFunds.numTwentyEuroNotes--;
        bankFunds.totalFunds -= Money.TWENTY_EURO_NOTES;
        amount -= Money.TWENTY_EURO_NOTES;
        transaction.notes.set(Money.TWENTY_EURO_NOTES, numOfTwentyNotesToDispense++);
      } else if (
        amount >= Money.TEN_EURO_NOTES &&
        bankFunds.numTenEuroNotes != 0
      ) {
        bankFunds.numTenEuroNotes--;
        bankFunds.totalFunds -= Money.TEN_EURO_NOTES;
        amount -= Money.TEN_EURO_NOTES;
        transaction.notes.set(Money.TEN_EURO_NOTES, numOfTenNotesToDispense++);
      } else if (
        amount >= Money.FIVE_EURO_NOTES &&
        bankFunds.numFiveEuroNotes != 0
      ) {
        bankFunds.numFiveEuroNotes--;
        bankFunds.totalFunds -= Money.FIVE_EURO_NOTES;
        amount -= Money.FIVE_EURO_NOTES;
        transaction.notes.set(Money.FIVE_EURO_NOTES, numOfFiveNotesToDispense++);
      }
    } while (amount > 0)

    try {
      await this.atmFundRepo.updateATMFunds(bankFunds);
    } catch (error) {
      return new Error('Failed to update bank funds');
    }
  }

  async lodgeMoniesToAtmFund(lodgementAmount: number, notes: Map<Money, number>) {
    let bankFunds = await this.atmFundRepo.getFunds();
    bankFunds.totalFunds += lodgementAmount;
    notes.forEach((value, key) => {
      switch (key) {
        case Money.FIFTY_EURO_NOTES:
          bankFunds.numFiftyEuroNotes += value;
          break;
        case Money.TWENTY_EURO_NOTES:
          bankFunds.numTwentyEuroNotes += value;
          break;
        case Money.TEN_EURO_NOTES:
          bankFunds.numTenEuroNotes += value;
          break;
        case Money.FIVE_EURO_NOTES:
          bankFunds.numFiveEuroNotes += value;
          break;
      }
    })

    try {
      await this.atmFundRepo.updateATMFunds(bankFunds);
    } catch (error) {
      return new Error('Failed to update bank funds');
    }
  }

  async checkATMFunds(amount: number) {
    const bankFunds = await this.atmFundRepo.getFunds();
    if (amount > bankFunds.totalFunds) {
      return new InternalServerErrorException('Insufficient Funds in ATM for your request');
    }
  }
}