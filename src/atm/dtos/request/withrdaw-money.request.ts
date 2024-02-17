import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class WithdrawMoneyRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  readonly amount: number;
}
