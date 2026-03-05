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
  currentStart: Date = new Date();
  selectedEvent: DiffEntityResult | null = null;

  constructor(
    private sse: SseService,
    private entitiesState: EntitiesStateService,
  ) {}

  ngOnInit() {
    this.connectDefault();
    // subscribe to state service for all entities
    this.subs.push(
      this.entitiesState.entities$.subscribe((list) => {
        this.events = list;
      }),
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    this.sse.closeConnection();
  }

  connectDefault() {
      const start = this.currentStart.toISOString();
      const end = new Date(
        this.currentStart.getTime() + 7 * 24 * 3600 * 1000,
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
    this.changeRange();
  }

  prevWeek() {
    this.currentStart = new Date(
      this.currentStart.getTime() - 7 * 24 * 3600 * 1000,
    );
    this.changeRange();
  }

  changeRange() {
    const start = this.currentStart.toISOString();
    const end = new Date(
      this.currentStart.getTime() + 7 * 24 * 3600 * 1000,
    ).toISOString();
    this.sse.changeRange(start, end, 'week');
  }

  showDetails(e: DiffEntityResult) {
    this.selectedEvent = e;
  }
}
