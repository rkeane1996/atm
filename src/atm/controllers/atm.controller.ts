import { Controller } from '@nestjs/common';
import { AtmService } from '../services/atm.service';


@Controller('atm')
export class AtmController {
  constructor(private atmService: AtmService) {}

}
