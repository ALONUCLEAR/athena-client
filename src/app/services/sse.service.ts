import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { DiffEntityResult, SessionEvent, ChunkPayload } from '../models/diff';
import { EntitiesStateService } from '../stores/entities-state.service';

@Injectable({ providedIn: 'root' })
export class SseService {
  private eventSource?: EventSource;
  private sessionId: string | null = null;

  private entitiesSubject = new Subject<DiffEntityResult>();
  entities$ = this.entitiesSubject.asObservable();

  private statusSubject = new BehaviorSubject<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');
  connectionStatus$ = this.statusSubject.asObservable();

  private heartbeatSubject = new Subject<number>();
  heartbeat$ = this.heartbeatSubject.asObservable();

  private entityVersions: Record<string, Record<string, number>> = {};

  private chunkBuffers = new Map<
    string,
    { fragments: string[]; totalChunks: number }
  >();

  private reconnectAttempts = 0;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private entitiesState: EntitiesStateService,
  ) {}

  openConnection(userId: string, params: {
    squadronIds: string[];
    dataGroup?: string;
    startDate?: string;
    endDate?: string;
  }) {
    this.statusSubject.next('connecting');

    const query = new URLSearchParams();

    params.squadronIds.forEach((id) => {
      query.append('squadronIds', id);
    });

    query.set('userId', userId);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.dataGroup) query.set('dataGroup', params.dataGroup);
    if (this.entityVersions)  query.set('entityVersions', JSON.stringify(this.entityVersions));

    const url = `${environment.apiUrl}/sse/events?${query.toString()}`;

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      this.statusSubject.next('connected');
      this.reconnectAttempts = 0;
    };

    this.eventSource.onerror = () => {
      this.statusSubject.next('disconnected');
      this.scheduleReconnect(params);
    };

    this.eventSource.addEventListener('heartbeat', (e: MessageEvent) => {
      const ts = Number(e.data);
      this.heartbeatSubject.next(ts);
    });

    this.eventSource.addEventListener('session', (e: MessageEvent) => {
      const obj = JSON.parse(e.data) as SessionEvent;
      this.sessionId = obj.sessionId;
    });

    this.eventSource.addEventListener('data-bulk', (e: MessageEvent) => {
      const payload = JSON.parse(e.data) as DiffEntityResult;
      this.processEntity(payload);
    });

    this.eventSource.addEventListener('data-chunk', (e: MessageEvent) => {
      const chunk = JSON.parse(e.data) as ChunkPayload;
      this.processChunk(chunk);
    });

    this.eventSource.addEventListener('data-complete', (e: MessageEvent) => {
      const { entityName, entityId, version } = JSON.parse(e.data) as {
        entityName: string;
        entityId: string;
        version: number;
      };
      this.finishChunkedEntity(entityName, entityId, version);
    });

    this.eventSource.addEventListener('error', (e: MessageEvent) => {
      console.error('SSE error event', e.data);
    });
  }

  changeRange(startDate: string, endDate: string) {
    // close and reopen connection
    this.closeConnection();
    this.openConnection('mock-user', {
      squadronIds: ['101'],
      startDate,
      endDate,
    });
  }

  closeConnection() {
    this.eventSource?.close();
    this.eventSource = undefined;
    this.statusSubject.next('disconnected');
  }

  private scheduleReconnect(params: {
    squadronIds: string[];
    startDate?: string;
    endDate?: string;
  }) {
    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts));
    this.reconnectAttempts++;
    timer(delay).subscribe(() => {
      this.openConnection('mock-user', params);
    });
  }

  private processEntity(entity: DiffEntityResult) {
    // update version immediately since we already received whole object
    if (!this.entityVersions[entity.entityName]) {
      this.entityVersions[entity.entityName] = {};
    }
    this.entityVersions[entity.entityName][entity.entityId] = entity.version;
    this.entitiesSubject.next(entity);
    // also update state service
    this.entitiesState.upsert(entity);
  }

  private processChunk(chunk: ChunkPayload) {
    const key = `${chunk.entityName}@${chunk.version}`;
    let buffer = this.chunkBuffers.get(key);
    if (!buffer) {
      buffer = { fragments: [], totalChunks: chunk.totalChunks };
      this.chunkBuffers.set(key, buffer);
    }
    buffer.fragments[chunk.chunkIndex] = chunk.payloadFragment;
    if (buffer.fragments.filter(Boolean).length === buffer.totalChunks) {
      // all fragments received
      const combined = buffer.fragments.join('');
      const payload: DiffEntityResult = JSON.parse(combined);
      this.processEntity(payload);
      this.chunkBuffers.delete(key);
    }
  }

  private finishChunkedEntity(
    entityName: string,
    entityId: string,
    version: number,
  ) {
    // already handled when all fragments exist in processChunk;
    // keep for protocol completeness if server sends a marker before last fragment.
    if (!this.entityVersions[entityName]) {
      this.entityVersions[entityName] = {};
    }
    this.entityVersions[entityName][entityId] = version;
  }
}
