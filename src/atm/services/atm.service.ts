import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Money } from '../data/enums/money.enum';
import { AtmFundRepository } from '../repositories/atm-fund.repository';
import { TransactionDto } from 'src/transaction/dtos/transaction.dto';

@Injectable()
export class AtmService {
  constructor(
    private atmFundRepo: AtmFundRepository,
  ) {}

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
        bankFunds.numFiftyEuroNotes --;
        bankFunds.totalFunds -= Money.FIFTY_EURO_NOTES;
        amount -= Money.FIFTY_EURO_NOTES;
        transaction.notes.set(Money.FIFTY_EURO_NOTES, numOfFiftyNotesToDispense++);
      } else if (
        amount >= Money.TWENTY_EURO_NOTES &&
        bankFunds.numTwentyEuroNotes != 0
      ) {
        bankFunds.numTwentyEuroNotes --;
        bankFunds.totalFunds -= Money.TWENTY_EURO_NOTES;
        amount -= Money.TWENTY_EURO_NOTES;
        transaction.notes.set(Money.TWENTY_EURO_NOTES, numOfTwentyNotesToDispense++);
      } else if (
        amount >= Money.TEN_EURO_NOTES &&
        bankFunds.numTenEuroNotes != 0
      ) {
        bankFunds.numTenEuroNotes --;
        bankFunds.totalFunds -= Money.TEN_EURO_NOTES;
        amount -= Money.TEN_EURO_NOTES;
        transaction.notes.set(Money.TEN_EURO_NOTES, numOfTenNotesToDispense++);
      } else if (
        amount >= Money.FIVE_EURO_NOTES &&
        bankFunds.numFiveEuroNotes != 0
      ) {
        bankFunds.numFiveEuroNotes --;
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

  async lodgeMoniesToAtmFund(lodgementAmount: number, notes: Map<Money, number>, transaction: TransactionDto) {
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

  async checkATMFunds(amount: number){
    const bankFunds = await this.atmFundRepo.getFunds();
    if (amount > bankFunds.totalFunds) {
      return new InternalServerErrorException('Insufficient Funds in ATM for your request');
    }
  }
}