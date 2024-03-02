import { Module } from '@nestjs/common';
import { AtmService } from './services/atm.service';
import { AtmController } from './controllers/atm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AtmFund, AtmFundSchema } from './data/schemas/atm-fund.schema';
import { AtmFundRepository } from './repositories/atm-fund.repository';

@Module({
  controllers: [AtmController],
  providers: [
    AtmService,
    AtmFundRepository,
  ],
  exports:[ AtmService ],
  imports: [
    MongooseModule.forFeature([
      { name: AtmFund.name, schema: AtmFundSchema },
    ]),
  ],
})
export class AtmModule {}
