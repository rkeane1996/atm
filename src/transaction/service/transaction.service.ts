import { Injectable } from '@nestjs/common';
import { TransactionRepoistory } from '../repositories/transaction.repository';
import { TransactionDto } from '../dtos/transaction.dto';
import { Money } from '../../atm/data/enums/money.enum';
import { TransactionStatus } from '../../atm/data/enums/transactionStatus.enum';

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepo: TransactionRepoistory,
      ) {}


    async performWithdrawTransaction(){}  

    async performLodgementTransaction(){} 

    async createTransaction(transactionDetails: TransactionDto){
        const transaction = await this.transactionRepo.createTransaction({
            userId: transactionDetails.userId,
            transactionAmount: transactionDetails.transactionAmount,
            notesDispensed: new Map<Money, number>(),
            status: TransactionStatus.PENDING,
        });
        return transaction;
    }

    async failTransaction(transactionDetails: TransactionDto){
        await this.transactionRepo.updateTransactionStatus(transactionDetails._id, TransactionStatus.FAILED);
    }

    async completeTransaction(transactionDetails: TransactionDto){
        await this.transactionRepo.completeTransaction(transactionDetails._id, transactionDetails);
    }
}

