import { AtmFund } from '../data/schemas/atm-fund.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtmFundDocument } from '../data/documents/atm-fund.document';
import { NotFoundException } from '@nestjs/common';
import { AtmFundDto } from '../dtos/atmFund.dto';

export class AtmFundRepository {
  constructor(
    @InjectModel(AtmFund.name)
    private atmFundModel: Model<AtmFundDocument>,
  ) {}

  async getFunds(): Promise<AtmFund> {
    try {
      const funds = await this.atmFundModel.findOne().exec();
      if (!funds) {
        throw new NotFoundException('No atm funds available. Please try again later');
      }
      return funds;
    } catch (error) {
      console.error('Error fetching funds:', error);
      throw error;
    }
  }

  async updateATMFunds(funds: AtmFundDto) {
    const atmFundId = funds.atmFundId
    try {
      await this.atmFundModel
        .updateOne(
          {atmFundId},
          {
            $set: {
              totalFunds: funds.totalFunds,
              numFiftyEuroNotes: funds.numFiftyEuroNotes,
              numTwentyEuroNotes: funds.numTwentyEuroNotes,
              numTenEuroNotes: funds.numTenEuroNotes,
              numFiveEuroNotes: funds.numFiveEuroNotes,
            },
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }
}
