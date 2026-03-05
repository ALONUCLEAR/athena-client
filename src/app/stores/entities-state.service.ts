import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DiffEntityResult } from '../models/diff';

@Injectable({ providedIn: 'root' })
export class EntitiesStateService {
  private entitiesMap = new Map<string, DiffEntityResult>();
  private entitiesSubject = new BehaviorSubject<DiffEntityResult[]>([]);

  entities$: Observable<DiffEntityResult[]> =
    this.entitiesSubject.asObservable();

  getEntitiesByGroup$(group: string): Observable<DiffEntityResult[]> {
    return this.entities$.pipe(
      map((entities) =>
        entities.filter((e) => e.data.dataGroup === group && !e.data.deleted),
      ),
    );
  }

  upsert(entity: DiffEntityResult) {
    if (!entity.data?.dataGroup) {
      console.warn('Received entity without dataGroup, ignoring:', entity);
      return;
    }
    if (entity.data.deleted) {
      this.entitiesMap.delete(entity.entityName);
    } else {
      this.entitiesMap.set(entity.entityName, entity);
    }
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
