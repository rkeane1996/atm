import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schema/transaction.schema';
import { TransactionDocument } from '../document/transaction.document';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionStatus } from '../../atm/data/enums/transactionStatus.enum';

export class TransactionRepoistory {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async createTransaction(transaction: TransactionDto) {
    try {
      const newTransaction = await this.transactionModel.create({
        userId: transaction.userId,
        transactionAmount: transaction.transactionAmount,
        notesDispensed: transaction.notesDispensed,
        status: transaction.status,
      });
      console.log('Transaction Created:', newTransaction);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async completeTransaction(
    _id: string,
    transaction: TransactionDto,
  ) {
    console.log("🚀 ~ file: transaction.repository.ts:34 ~ TransactionRepoistory ~ transactionId:", _id)
    try {
      const updatedUser = await this.transactionModel
        .updateOne(
          { _id },
          {
            $set: {
              notesDispensed: transaction.notesDispensed,
              status: transaction.status,
            },
          },
          { new: true },
        )
        .exec();

      return updatedUser;
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }

  async updateTransactionStatus(
    _id: string,
    transactionStatus: TransactionStatus,
  ) {
    try {
      const updatedUser = await this.transactionModel
        .updateOne(
          { _id },
          { $set: { status: transactionStatus} },
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
