import { Controller, Put, UseGuards } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { WithdrawMoneyResponseDto } from 'src/atm/dtos/response/withdraw-money.response';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @UseGuards(AuthGuard)
    @Put('/withdraw')
    async withdrawMoney(
        //detais in request body
    ): Promise<WithdrawMoneyResponseDto | Error> {
        return await this.transactionService.performWithdrawTransaction() as unknown as WithdrawMoneyResponseDto;
    }

    @UseGuards(AuthGuard)
    @Put('/lodge')
    async lodgeMoney(
        //details in request body
    ): Promise<WithdrawMoneyResponseDto | Error> {
        return await this.transactionService.performLodgementTransaction() as unknown as WithdrawMoneyResponseDto;
    }
}
