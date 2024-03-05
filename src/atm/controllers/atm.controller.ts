import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AtmService } from '../services/atm.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { LodgeMoneyRequestDto } from '../dtos/lodgement-request.dto';
import { WithdrawMoneyResponseDto } from '../dtos/withdraw-money.response';
import { WithdrawMoneyRequestDto } from '../dtos/withdraw-request.dto';


@Controller('atm')
export class AtmController {
  constructor(private atmService: AtmService) {}

  @UseGuards(AuthGuard)
    @Put('/withdraw')
    async withdrawMoney(
        @Body() request: WithdrawMoneyRequestDto
    ): Promise<WithdrawMoneyResponseDto | Error> {
        return await this.atmService.performWithdrawRequest(request) as unknown as WithdrawMoneyResponseDto;
    }

    @UseGuards(AuthGuard)
    @Put('/lodge')
    async lodgeMoney(
        @Body() request: LodgeMoneyRequestDto
    ): Promise<WithdrawMoneyResponseDto | Error> {
        return await this.atmService.performLodgementRequest(request) as unknown as WithdrawMoneyResponseDto;
    }
}
