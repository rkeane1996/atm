import { IsNotEmpty, IsNumber, IsDefined } from "class-validator";

export class WithdrawMoneyRequestDto {
    @IsNotEmpty()
    @IsNumber()
    @IsDefined()
    readonly amount: number;

    @IsNotEmpty()
    @IsNumber()
    @IsDefined()
    readonly accounNumber: number;
  }