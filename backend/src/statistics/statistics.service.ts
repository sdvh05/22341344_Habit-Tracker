import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitDocument } from '../schemas/habit.schema';
import { HabitRecord, RecordDocument } from '../schemas/record.schema';

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<HabitDocument>,
    @InjectModel(HabitRecord.name) private recordModel: Model<RecordDocument>,
  ) {}

  async getSummary(userId: string) {
    const activeHabits = await this.habitModel.countDocuments({
      usuario: userId,
      activo: true,
    });

    const today = localDateString(new Date());
    const todayRecords = await this.recordModel.find({
      usuario: userId,
      completado: true,
    });

    const completedToday = todayRecords.filter(
      (r) => toDateOnly(r.fecha) === today,
    ).length;

    const completedDates = Array.from(
      new Set(todayRecords.map((r) => toDateOnly(r.fecha))),
    ).sort();

    const currentStreak = this.calculateCurrentStreak(completedDates);
    const bestStreak = this.calculateBestStreak(completedDates);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const allRecordsLast30 = await this.recordModel.find({
      usuario: userId,
      fecha: { $gte: thirtyDaysAgo },
    });
    const completionRate =
      allRecordsLast30.length === 0
        ? 0
        : Math.round(
            (allRecordsLast30.filter((r) => r.completado).length /
              allRecordsLast30.length) *
              100,
          );

    const totalCompletions = await this.recordModel.countDocuments({
      usuario: userId,
      completado: true,
    });

    const mostConsistentHabit = await this.getMostConsistentHabit(userId);

    return {
      activeHabits,
      completedToday,
      currentStreak,
      bestStreak,
      completionRate,
      totalCompletions,
      mostConsistentHabit,
    };
  }

  private async getMostConsistentHabit(userId: string) {
    const activeHabits = await this.habitModel.find({
      usuario: userId,
      activo: true,
    });
    if (activeHabits.length === 0) return null;

    let best: { nombre: string; percent: number } | null = null;

    for (const habit of activeHabits) {
      const start = new Date(habit.fechaInicio);
      const now = new Date();
      const daysSinceStart = Math.max(
        1,
        Math.floor((now.getTime() - start.getTime()) / 86400000) + 1,
      );

      const completedDays = await this.recordModel.countDocuments({
        usuario: userId,
        habito: habit._id,
        completado: true,
      });

      const percent = Math.min(
        100,
        Math.round((completedDays / daysSinceStart) * 100),
      );

      if (!best || percent > best.percent) {
        best = { nombre: habit.nombre, percent };
      }
    }

    return best;
  }

  async getWeekly(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    return this.getRangeCounts(
      userId,
      sevenDaysAgo,
      new Date(Date.now() + 86400000),
    );
  }

  async getMonthly(userId: string, year: number, month: number) {
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 1);
    return this.getRangeCounts(userId, from, to);
  }

  private async getRangeCounts(userId: string, from: Date, to: Date) {
    const records = await this.recordModel.find({
      usuario: userId,
      completado: true,
      fecha: { $gte: from, $lt: to },
    });

    const counts: Record<string, number> = {};
    for (const r of records) {
      const key = toDateOnly(r.fecha);
      counts[key] = (counts[key] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([fecha, completados]) => ({ fecha, completados }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  private calculateCurrentStreak(sortedDates: string[]): number {
    if (sortedDates.length === 0) return 0;
    const dateSet = new Set(sortedDates);
    let streak = 0;
    const cursor = new Date();

    while (dateSet.has(localDateString(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  private calculateBestStreak(sortedDates: string[]): number {
    if (sortedDates.length === 0) return 0;
    let best = 1;
    let current = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays =
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 1;
      }
    }
    return best;
  }
}
