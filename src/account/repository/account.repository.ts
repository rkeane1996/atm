import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../schema/account.schema';
import { AccountDocument } from '../document/account.document';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AccountDto } from '../dto/account.dto';
import * as bcrypt from 'bcrypt';

export class AccountRepository {
  constructor(
    @InjectModel(Account.name)
    private account: Model<AccountDocument>,
  ) {}

  async getAccount(accountNumber: number): Promise<Account> {
    try {
      const account = await this.account.findOne({ accountNumber }).exec();
      if (!account) {
        throw new NotFoundException('User Id not found');
      }
      return account;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  async insertAccount(account: AccountDto): Promise<Account> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPin = bcrypt.hashSync(account.pin.toString(), salt);
    account.pin = hashedPin
    try {
      const newAccount = await this.account.create(account);
      return newAccount;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw new InternalServerErrorException('Account not created');
    }
  }

  async updateAccountBalance(accountNumber: number, newOpeningBalance: number) {
    try {
      const updatedUser = await this.account
        .updateOne(
          { accountNumber },
          { $set: { openingBalance: newOpeningBalance } },
          { new: true },
        )
        .exec();

      return updatedUser;
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }
}