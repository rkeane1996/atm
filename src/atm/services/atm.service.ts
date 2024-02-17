import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Money } from '../data/enums/money.enum';
import { WithdrawMoneyResponseDto } from '../dtos/response/withdraw-money.response';
import { AtmFundRepository } from '../repositories/atm-fund.repository';
import { TransactionStatus } from '../data/enums/transactionStatus.enum';
import { AtmFundDto } from '../dtos/atmFund.dto';
import { TransactionService } from '../../transaction/service/transaction.service';
import { AccountService } from 'src/account/service/account.service';

@Injectable()
export class AtmService {
  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private atmFundRepo: AtmFundRepository,
  ) {}

  transaction: any;

  async withdrawMonies(amount: number, userId: number) {
    const bankFunds = await this.atmFundRepo.getFunds();
    if (amount > bankFunds.totalFunds) {
      return new InternalServerErrorException('Insufficient Funds in ATM for your request');
    }

    const account = await this.accountService.getAccount(userId);

    this.transaction = await this.transactionService.createTransaction({
      userId: account.accountNumber,
      transactionAmount: amount,
      notesDispensed: new Map<Money, number>(),
      status: TransactionStatus.PENDING,
    });

    await this.withdrawMoniesFromBank(amount,bankFunds)
    await this.accountService.updateAccountBalance(amount, account);
    this.transaction.status = TransactionStatus.COMPLETE;
    await this.transactionService.completeTransaction(
      this.transaction
    );
    return new WithdrawMoneyResponseDto(this.transaction.notesDispensed);
  }



  
  private async withdrawMoniesFromBank(amount: number, bankFunds: AtmFundDto) {
    let numOfFiftyNotesToDispense = 1;
    let numOfTwentyNotesToDispense = 1;
    let numOfTenNotesToDispense = 1;
    let numOfFiveNotesToDispense = 1;

    do {
      if (
        amount >= Money.FIFTY_EURO_NOTES &&
        bankFunds.numFiftyEuroNotes != 0
      ) {
        bankFunds.numFiftyEuroNotes --;
        bankFunds.totalFunds -= Money.FIFTY_EURO_NOTES;
        amount -= Money.FIFTY_EURO_NOTES;
        this.transaction.notesDispensed.set(Money.FIFTY_EURO_NOTES.toString(), numOfFiftyNotesToDispense++);
      } else if (
        amount >= Money.TWENTY_EURO_NOTES &&
        bankFunds.numTwentyEuroNotes != 0
      ) {
        bankFunds.numTwentyEuroNotes --;
        bankFunds.totalFunds -= Money.TWENTY_EURO_NOTES;
        amount -= Money.TWENTY_EURO_NOTES;
        this.transaction.notesDispensed.set(Money.TWENTY_EURO_NOTES.toString(),numOfTwentyNotesToDispense++);
      } else if (
        amount >= Money.TEN_EURO_NOTES &&
        bankFunds.numTenEuroNotes != 0
      ) {
        bankFunds.numTenEuroNotes --;
        bankFunds.totalFunds -= Money.TEN_EURO_NOTES;
        amount -= Money.TEN_EURO_NOTES;
        this.transaction.notesDispensed.set(Money.TEN_EURO_NOTES.toString(), numOfTenNotesToDispense++);
      } else if (
        amount >= Money.FIVE_EURO_NOTES &&
        bankFunds.numFiveEuroNotes != 0
      ) {
        bankFunds.numFiveEuroNotes --;
        bankFunds.totalFunds -= Money.FIVE_EURO_NOTES;
        amount -= Money.FIVE_EURO_NOTES;
        this.transaction.notesDispensed.set(Money.FIVE_EURO_NOTES.toString(), numOfFiveNotesToDispense++);
      }
    } while (amount > 0)

    try {
      await this.atmFundRepo.updateATMFunds(bankFunds);
    } catch (error) {
      await this.transactionService.failTransaction(this.transaction);
      return new Error('Failed to update bank funds');
    }
  } 

}