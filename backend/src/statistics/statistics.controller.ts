import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  getSummary(@Req() req: any) {
    return this.statisticsService.getSummary(req.user.userId);
  }

  @Get('weekly')
  getWeekly(@Req() req: any) {
    return this.statisticsService.getWeekly(req.user.userId);
  }

  @Get('monthly')
  getMonthly(
    @Req() req: any,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const m = month ? parseInt(month, 10) : now.getMonth() + 1;
    return this.statisticsService.getMonthly(req.user.userId, y, m);
  }
}
