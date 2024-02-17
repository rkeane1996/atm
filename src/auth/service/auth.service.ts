import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/service/account.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private accountService: AccountService,
        private jwtService: JwtService) {}

  async signIn(accountNumber: number, pin: string): Promise<any> {
    const account = await this.accountService.getAccount(accountNumber);
    if(!await bcrypt.compare(pin, account.pin)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: account.accountNumber, username: account.pin };
    return {
       access_token: await this.jwtService.signAsync(payload),
    };
  }
}
