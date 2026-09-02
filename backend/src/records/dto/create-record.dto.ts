import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateRecordDto {
  @IsMongoId()
  habito: string;

  //@IsMongoId()
  //usuario: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsBoolean()
  completado?: boolean;
}
