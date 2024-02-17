import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'account' })
export class Account {
  @Prop({ required: true })
  accountNumber: number;

  @Prop({ required: true })
  pin: string;

  @Prop({ required: true })
  openingBalance: number;

  @Prop({ required: true })
  overdraft: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
