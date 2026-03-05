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

  constructor(
    private sse: SseService,
    private entitiesState: EntitiesStateService,
  ) {}

  ngOnInit() {
    this.connectedDefault();
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

  connectedDefault() {
    this.sse.openConnection('mock-user', {
      squadronIds: ['101'],
      dataGroup: this.currentDataGroup,
    });
  }

  changeRequestedData(dataGroup: DataGroup) {
    // for example, switch from "eventA" to "eventB" - this would be a change in the entity types we're subscribed to
    this.currentDataGroup = dataGroup;
    this.sse.closeConnection();
    this.sse.openConnection('mock-user', {
      squadronIds: ['101'],
      dataGroup: this.currentDataGroup,
    });
  }
}
