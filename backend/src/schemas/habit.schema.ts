import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HabitDocument = Habit & Document;

export enum Frecuencia {
  DIARIA = 'diaria',
  SEMANAL = 'semanal',
  PERSONALIZADA = 'personalizada',
}

@Schema({ timestamps: true })
export class Habit {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop()
  categoria: string;

  @Prop({ type: String, enum: Frecuencia, required: true })
  frecuencia: Frecuencia;

  @Prop({ default: 0 })
  prioridad: number;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop()
  fechaFin: Date;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario: Types.ObjectId;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
