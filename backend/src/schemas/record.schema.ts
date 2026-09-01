import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecordDocument = HabitRecord & Document;

@Schema({ timestamps: true })
export class HabitRecord {
  @Prop({ type: Types.ObjectId, ref: 'Habit', required: true })
  habito: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario: Types.ObjectId;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ default: false })
  completado: boolean;
}

export const RecordSchema = SchemaFactory.createForClass(HabitRecord);
