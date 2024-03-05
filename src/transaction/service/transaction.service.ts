import { Injectable } from '@nestjs/common';
import { TransactionRepoistory } from '../repositories/transaction.repository';
import { TransactionDto } from '../dtos/transaction.dto';
import { Money } from '../../atm/data/enums/money.enum';
import { TransactionStatus } from '../../atm/data/enums/transactionStatus.enum';

@Injectable()
export class TransactionService {
    constructor(
        private readonly transactionRepo: TransactionRepoistory,
      ) {}


    async createTransaction(transactionDetails: TransactionDto){
        const transaction = await this.transactionRepo.createTransaction({
            userId: transactionDetails.userId,
            transactionAmount: transactionDetails.transactionAmount,
            transactionType : transactionDetails.transactionType,
            notes: new Map<Money, number>(),
            status: TransactionStatus.PENDING,
        });
        return transaction as unknown as TransactionDto;
    }

    async updateTransactionStatus(transactionDetails: TransactionDto, transactionStatus: TransactionStatus){
        await this.transactionRepo.updateTransactionStatus(transactionDetails._id, transactionStatus);
    }
}

