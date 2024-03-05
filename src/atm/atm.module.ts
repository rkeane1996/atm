import { Module } from '@nestjs/common';
import { AtmService } from './services/atm.service';
import { AtmController } from './controllers/atm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AtmFund, AtmFundSchema } from './data/schemas/atm-fund.schema';
import { AtmFundRepository } from './repositories/atm-fund.repository';
import { AccountModule } from 'src/account/account.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  controllers: [AtmController],
  providers: [
    AtmService,
    AtmFundRepository,
  ],
  imports: [
    AccountModule,
    TransactionModule,
    MongooseModule.forFeature([
      { name: AtmFund.name, schema: AtmFundSchema },
    ]),
  ],
})
export class AtmModule {}
