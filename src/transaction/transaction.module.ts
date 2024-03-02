import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionRepoistory } from './repositories/transaction.repository';
import { TransactionController } from './controllers/transaction.controller';
import { AtmModule } from 'src/atm/atm.module';
import { AccountModule } from 'src/account/account.module';

@Module({
    providers: [
      TransactionService,
      TransactionRepoistory
    ],
    imports: [
      AtmModule,
      AccountModule,
      MongooseModule.forFeature([
        { name: Transaction.name, schema: TransactionSchema },
    ],)],
    controllers: [TransactionController]
  })
export class TransactionModule {}
