import { IsNotEmpty, IsNumber, IsDefined } from "class-validator";
import { Money } from "../data/enums/money.enum";

export class AddMoneyToAtmFundRequestDto {
    @IsNotEmpty()
    @IsNumber()
    @IsDefined()
    readonly totalAmount: number;
 
    @IsNotEmpty()
    @IsDefined()
    readonly notes: Map<Money, number>;
}