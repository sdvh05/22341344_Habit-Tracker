import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { HabitRecord, RecordSchema } from '../schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HabitRecord.name, schema: RecordSchema },
    ]),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
