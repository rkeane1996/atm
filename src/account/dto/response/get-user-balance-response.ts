export class GetUserBalanceResponseDto {
  constructor(balance: number) {
    this.message = `Your Account Balance is €${balance}`;
  }
  message: string;
}
