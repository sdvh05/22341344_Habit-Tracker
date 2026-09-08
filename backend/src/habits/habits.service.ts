import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitDocument } from '../schemas/habit.schema';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<HabitDocument>,
  ) {}

  create(createHabitDto: CreateHabitDto & { usuario: string }) {
    const created = new this.habitModel(createHabitDto);
    return created.save();
  }

  findAll(userId?: string) {
    const filter = userId ? { usuario: userId } : {};
    return this.habitModel.find(filter).exec();
  }

  async findOne(id: string) {
    const habit = await this.habitModel.findById(id).exec();
    if (!habit) throw new NotFoundException(`Hábito ${id} no encontrado`);
    return habit;
  }

  async update(id: string, updateHabitDto: UpdateHabitDto) {
    const habit = await this.habitModel
      .findByIdAndUpdate(id, updateHabitDto, { new: true })
      .exec();
    if (!habit) throw new NotFoundException(`Hábito ${id} no encontrado`);
    return habit;
  }

  async remove(id: string) {
    const habit = await this.habitModel.findByIdAndDelete(id).exec();
    if (!habit) throw new NotFoundException(`Hábito ${id} no encontrado`);
    return habit;
  }
}
