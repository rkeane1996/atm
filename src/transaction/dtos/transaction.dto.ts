import { Transaction } from '../schema/transaction.schema';
import { Money } from '../../atm/data/enums/money.enum';
import { TransactionStatus } from '../../atm/data/enums/transactionStatus.enum';

export class TransactionDto implements Transaction {
  _id?: string;
  userId: number;
  transactionType: string;
  transactionAmount: number;
  notes: Map<Money, number>;
  status: TransactionStatus;
}