import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { WithdrawMoneyResponseDto } from 'src/atm/dtos/withdraw-money.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { LodgeMoneyRequestDto } from '../../atm/dtos/lodgement-request.dto';
import { WithdrawMoneyRequestDto } from '../../atm/dtos/withdraw-request.dto';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    
}
