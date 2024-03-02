import { AtmFund } from "../data/schemas/atm-fund.schema";

export class AtmFundDto implements AtmFund {
    atmFundId?: string;
    totalFunds: number;
    numFiftyEuroNotes: number;
    numTwentyEuroNotes: number;
    numTenEuroNotes: number;
    numFiveEuroNotes: number;
    
}