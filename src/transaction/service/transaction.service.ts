import { Injectable } from '@nestjs/common';
import { TransactionRepoistory } from '../repositories/transaction.repository';
import { TransactionDto } from '../dtos/transaction.dto';
import { Money } from '../../atm/data/enums/money.enum';
import { TransactionStatus } from '../../atm/data/enums/transactionStatus.enum';
import { WithdrawMoneyRequestDto } from '../dtos/withdraw-request.dto';
import { LodgeMoneyRequestDto } from '../dtos/lodgement-request.dto';
import { AtmService } from 'src/atm/services/atm.service';
import { AccountService } from 'src/account/service/account.service';
import { WithdrawMoneyResponseDto } from '../dtos/withdraw-money.response';
import { TransactionType } from '../dtos/constants/transaction-type';

@Injectable()
export class TransactionService {
    constructor(
        private atmService: AtmService,
        private accountService: AccountService,
        private transactionRepo: TransactionRepoistory,
      ) {}

    async performWithdrawTransaction(request: WithdrawMoneyRequestDto){
        this.atmService.checkATMFunds(request.amount);
        const account = await this.accountService.getAccount(request.accounNumber);
        let transaction = await this.createTransaction({
            userId: account.accountNumber,
            transactionAmount: request.amount,
            transactionType: TransactionType.WITHDRAWAL,
            notes: new Map<Money, number>(),
            status: TransactionStatus.PENDING,
          });
        try {
            await this.atmService.withdrawMoniesFromAtmFund(request.amount, transaction);
        } catch (error) {
            await this.updateTransactionStatus(transaction, TransactionStatus.FAILED_BANK_UPDATE);
            return error;
        }
        try{
            await this.accountService.creditAccountBalance(request.amount, account);
        }catch(error) {
            await this.updateTransactionStatus(transaction, TransactionStatus.FAILED_USER_UPDATE);
            return error;
        }
        await this.updateTransactionStatus(transaction,TransactionStatus.COMPLETE);
        return new WithdrawMoneyResponseDto(transaction.notes);
    }  

    async performLodgementTransaction(request: LodgeMoneyRequestDto){
        const account = await this.accountService.getAccount(request.accounNumber);
        let transaction = await this.createTransaction({
            userId: account.accountNumber,
            transactionAmount: request.lodgementAmount,
            transactionType: TransactionType.LODGEMENT,
            notes: new Map<Money, number>(),
            status: TransactionStatus.PENDING,
          });

          try {
            await this.atmService.lodgeMoniesToAtmFund(request.lodgementAmount, request.notes, transaction);
          } catch (error) {
            await this.updateTransactionStatus(transaction, TransactionStatus.FAILED_BANK_UPDATE);
            return error;
          }
          try {
            await this.accountService.debitAccountBalance(request.lodgementAmount, account);
          } catch (error) {
            await this.updateTransactionStatus(transaction, TransactionStatus.FAILED_USER_UPDATE);
            return error;
          }
        await this.updateTransactionStatus(transaction, TransactionStatus.COMPLETE);
        return new WithdrawMoneyResponseDto(transaction.notes);
    } 

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

