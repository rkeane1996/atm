import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AtmFund {

  @Prop()
  atmFundId?: string;

  @Prop({ required: true })
  totalFunds: number;

  @Prop({ required: true })
  numFiftyEuroNotes: number;

  @Prop({ required: true })
  numTwentyEuroNotes: number;

  @Prop({ required: true })
  numTenEuroNotes: number;

  @Prop({ required: true })
  numFiveEuroNotes: number;
}

export const AtmFundSchema = SchemaFactory.createForClass(AtmFund);
