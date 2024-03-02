import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repository/account.repository';
import { GetUserBalanceResponseDto } from 'src/account/dto/response/get-user-balance-response';
import { Account } from '../schema/account.schema';

@Injectable()
export class AccountService {
  constructor(
    private accountRepo: AccountRepository,
  ) { }

  async getAccount(userId: number) {
    return await this.accountRepo.getAccount(userId);
  }

  async getUserAccountBalance(userId: number) {
    const account = await this.getAccount(userId);

    const accountBalance = account.openingBalance;
    return new GetUserBalanceResponseDto(accountBalance);
  }

  async creditAccountBalance(amount: number, account: Account) {
    const newOpeningBalance = account.openingBalance - amount;
    this.updateAccountBalance(newOpeningBalance, account);
  }

  async debitAccountBalance(amount: number, account: Account) {
    const newOpeningBalance = account.openingBalance + amount;
    this.updateAccountBalance(newOpeningBalance, account);
  }

  async updateAccountBalance(newOpeningBalance: number, account: Account) {
    try {
      await this.accountRepo.updateAccountBalance(
        account.accountNumber,
        newOpeningBalance,
      );
    } catch (error) {
      return new Error('Failed to update user balance');
    }
  }
}
