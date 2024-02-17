import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDTO } from '../dtos/request/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: LoginDTO) {
        return this.authService.signIn(signInDto.accountNumber, signInDto.pin);
    }
}
