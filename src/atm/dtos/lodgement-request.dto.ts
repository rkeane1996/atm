import { IsNotEmpty, IsNumber, IsDefined } from "class-validator";
import { Money } from "src/atm/data/enums/money.enum";

export class LodgeMoneyRequestDto {
    @IsNotEmpty()
    @IsNumber()
    @IsDefined()
    readonly lodgementAmount: number;

    @IsNotEmpty()
    @IsDefined()
    readonly notes: Map<Money, number>;

    @IsNotEmpty()
    @IsNumber()
    @IsDefined()
    readonly accounNumber: number;
  }