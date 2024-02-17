import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserBalanceParamsDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  readonly userId: number;
}
