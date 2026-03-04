import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DiffEntityResult } from '../models/diff';

@Injectable({ providedIn: 'root' })
export class EntitiesStateService {
  private entitiesMap = new Map<string, DiffEntityResult>();
  private entitiesSubject = new BehaviorSubject<DiffEntityResult[]>([]);

  entities$: Observable<DiffEntityResult[]> =
    this.entitiesSubject.asObservable();

  upsert(entity: DiffEntityResult) {
    this.entitiesMap.set(entity.entityName, entity);
    this.emitAll();
  }

  upsertMany(entities: DiffEntityResult[]) {
    entities.forEach((e) => this.entitiesMap.set(e.entityName, e));
    this.emitAll();
  }

  getAll(): DiffEntityResult[] {
    return Array.from(this.entitiesMap.values());
  }

  getById(entityName: string): DiffEntityResult | undefined {
    return this.entitiesMap.get(entityName);
  }

  clear() {
    this.entitiesMap.clear();
    this.emitAll();
  }

  private emitAll() {
    this.entitiesSubject.next(Array.from(this.entitiesMap.values()));
  }
}
