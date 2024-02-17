import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserBalanceParamsDTO } from 'src/account/dto/request/get-user-balance-params-dto';
import { GetUserBalanceResponseDto } from 'src/account/dto/response/get-user-balance-response';
import { AccountService } from '../service/account.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('account')
export class AccountController {
  constructor(private atmService: AccountService) { }

  @UseGuards(AuthGuard)
  @Get('/userBalance/:userId')
  async getBalance(
    @Param() params: GetUserBalanceParamsDTO,
  ): Promise<GetUserBalanceResponseDto | Error> {
    return await this.atmService.getUserAccountBalance(params.userId);
  }
}
