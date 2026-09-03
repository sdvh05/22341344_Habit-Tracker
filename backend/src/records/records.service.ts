import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HabitRecord, RecordDocument } from '../schemas/record.schema';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(HabitRecord.name) private recordModel: Model<RecordDocument>,
  ) {}

  create(createRecordDto: CreateRecordDto & { usuario: string }) {
    const created = new this.recordModel(createRecordDto);
    return created.save();
  }

  //findAll() {
  //  return this.recordModel.find().exec();
  //}

  findAll(userId?: string) {
    const filter = userId ? { usuario: userId } : {};
    return this.recordModel.find(filter).exec();
  }

  async findOne(id: string) {
    const record = await this.recordModel.findById(id).exec();
    if (!record) throw new NotFoundException(`Registro ${id} no encontrado`);
    return record;
  }

  async update(id: string, updateRecordDto: UpdateRecordDto) {
    const record = await this.recordModel
      .findByIdAndUpdate(id, updateRecordDto, { new: true })
      .exec();
    if (!record) throw new NotFoundException(`Registro ${id} no encontrado`);
    return record;
  }

  async remove(id: string) {
    const record = await this.recordModel.findByIdAndDelete(id).exec();
    if (!record) throw new NotFoundException(`Registro ${id} no encontrado`);
    return record;
  }
}
