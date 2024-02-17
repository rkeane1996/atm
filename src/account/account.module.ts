import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './service/account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schema/account.schema';
import { AccountRepository } from './repository/account.repository';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    AccountRepository
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
  ],)]
})
export class AccountModule {}
