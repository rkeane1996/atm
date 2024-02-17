import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Money } from 'src/atm/data/enums/money.enum';
import { TransactionStatus } from '../../atm/data/enums/transactionStatus.enum';

@Schema()
export class Transaction {

  @Prop()
  transactionId?: string;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  transactionAmount: number;

  @Prop({ required: false })
  notesDispensed: Map<Money, number>;

  @Prop({ required: true })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
