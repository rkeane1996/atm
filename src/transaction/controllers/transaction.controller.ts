import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { WithdrawMoneyResponseDto } from 'src/transaction/dtos/withdraw-money.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { LodgeMoneyRequestDto } from '../dtos/lodgement-request.dto';
import { WithdrawMoneyRequestDto } from '../dtos/withdraw-request.dto';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @UseGuards(AuthGuard)
    @Put('/withdraw')
    async withdrawMoney(
        @Body() request: WithdrawMoneyRequestDto
    ): Promise<WithdrawMoneyResponseDto | Error> {
        return await this.transactionService.performWithdrawTransaction(request) as unknown as WithdrawMoneyResponseDto;
    }

    @UseGuards(AuthGuard)
    @Put('/lodge')
    async lodgeMoney(
        @Body() request: LodgeMoneyRequestDto
    ): Promise<WithdrawMoneyResponseDto | Error> {
        return await this.transactionService.performLodgementTransaction(request) as unknown as WithdrawMoneyResponseDto;
    }
}
