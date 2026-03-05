import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SseService } from '../../services/sse.service';
import { DiffEntityResult } from '../../models/diff';
import { EntitiesStateService } from '../../stores/entities-state.service';

@Component({
  selector: 'app-weekly-events',
  templateUrl: './weekly-events.component.html',
  styleUrls: ['./weekly-events.component.less'],
})
export class WeeklyEventsComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  events: DiffEntityResult[] = [];
  weekDays: Date[] = [];
  today: Date = new Date();
  currentStart: Date = this.getStartOfWeek(new Date());
  selectedEvent: DiffEntityResult | null = null;

  constructor(
    private sse: SseService,
    private entitiesState: EntitiesStateService,
  ) {}

  ngOnInit() {
    this.updateWeekDays();
    this.connectDefault();
    
    // Subscribe specifically to 'week' entities
    this.subs.push(
      this.entitiesState.getEntitiesByGroup$('week').subscribe((list) => {
        this.events = list;
      }),
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    this.sse.closeConnection();
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const start = new Date(d.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private updateWeekDays() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.currentStart);
      d.setDate(d.getDate() + i);
      this.weekDays.push(d);
    }
  }

  getEventsForDay(date: Date): DiffEntityResult[] {
    return this.events.filter(e => {
        const entityDate = (e.data as any).date;
        if (!entityDate) return false;
        const d = new Date(entityDate);
        return d.toDateString() === date.toDateString();
    });
  }

  connectDefault() {
      const start = this.currentStart.toISOString();
      const end = new Date(
        this.currentStart.getTime() + 7 * 24 * 3600 * 1000 - 1,
      ).toISOString();
      this.sse.openConnection('mock-user', {
        squadronIds: ['101'],
        startDate: start,
        endDate: end,
        dataGroup: 'week'
      });
  }

  nextWeek() {
    this.currentStart = new Date(
      this.currentStart.getTime() + 7 * 24 * 3600 * 1000,
    );
    this.updateWeekDays();
    this.changeRange();
  }

  prevWeek() {
    this.currentStart = new Date(
      this.currentStart.getTime() - 7 * 24 * 3600 * 1000,
    );
    this.updateWeekDays();
    this.changeRange();
  }

  changeRange() {
    const start = this.getStartOfWeek(this.currentStart).toISOString();
    const end = new Date(
      this.currentStart.getTime() + 7 * 24 * 3600 * 1000 - 1,
    ).toISOString();
    this.sse.changeRange(start, end, 'week');
  }

  showDetails(e: DiffEntityResult) {
    this.selectedEvent = e;
  }
}
