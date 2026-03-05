import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SseService } from '../../services/sse.service';
import { DiffEntityResult } from '../../models/diff';
import { EntitiesStateService } from '../../stores/entities-state.service';
import { DataGroup } from '../../models/dataGroup';

@Component({
  selector: 'app-event-updates',
  templateUrl: './event-updates.component.html',
  styleUrls: ['./event-updates.component.less'],
})
export class EventUpdatesComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  events: DiffEntityResult[] = [];
  currentDataGroup: DataGroup = 'eventA';
  selectedEvent: DiffEntityResult | null = null;

  constructor(
    private sse: SseService,
    private entitiesState: EntitiesStateService,
  ) {}

  ngOnInit() {
    this.connectedDefault();
    this.subscribeToGroup();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    this.sse.closeConnection();
  }

  private subscribeToGroup() {
    // Clear existing group-specific subscription if any
    if (this.subs.length > 0) {
      this.subs.forEach(s => s.unsubscribe());
      this.subs = [];
    }

    // Subscribe to state service for filtered entities
    this.subs.push(
      this.entitiesState.getEntitiesByGroup$(this.currentDataGroup).subscribe((list) => {
        this.events = list;
      }),
    );
  }

  connectedDefault() {
    this.sse.openConnection('mock-user', {
      squadronIds: ['101'],
      dataGroup: this.currentDataGroup,
    });
  }

  changeRequestedData(dataGroup: DataGroup) {
    this.currentDataGroup = dataGroup;
    this.sse.closeConnection();
    this.sse.openConnection('mock-user', {
      squadronIds: ['101'],
      dataGroup: this.currentDataGroup,
    });
    // Update subscription to the new group
    this.subscribeToGroup();
  }

  showDetails(event: DiffEntityResult) {
    this.selectedEvent = event;
  }

  hideDetails() {
    this.selectedEvent = null;
  }
}
