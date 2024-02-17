import { Account } from '../schema/account.schema';

export class AccountDto implements Account {
  accountNumber: number;
  pin: string;
  openingBalance: number;
  overdraft: number;
}
