import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  readonly accountNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  readonly pin: string;
}
