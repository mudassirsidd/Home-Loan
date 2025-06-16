import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { Bank } from './bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [BanksService],
  controllers: [BanksController],
})
export class BanksModule {}
