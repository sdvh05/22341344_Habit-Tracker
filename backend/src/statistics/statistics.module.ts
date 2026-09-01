import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Habit, HabitSchema } from '../schemas/habit.schema';
import { HabitRecord, RecordSchema } from '../schemas/record.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Habit.name, schema: HabitSchema },
      { name: HabitRecord.name, schema: RecordSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
