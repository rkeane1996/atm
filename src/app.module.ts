import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AtmModule } from './atm/atm.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
require('dotenv').config();

@Module({
  imports: [
    AtmModule, 
    MongooseModule.forRoot(process.env.MONGODB_URI), 
    AccountModule, 
    TransactionModule, AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
