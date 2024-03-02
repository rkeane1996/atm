import { Money } from '../../atm/data/enums/money.enum';

export class WithdrawMoneyResponseDto {
  constructor(notesDispensed: Map<Money, number>) {
    this.notesDispensed = notesDispensed;
  }
  notesDispensed: Map<Money, number>;
  message: 'Please Take Your Money';
}
