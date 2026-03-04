import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DiffEntityResult } from '../models/diff';

export interface EntitiesState extends EntityState<DiffEntityResult> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entities', idKey: 'entityName' })
export class EntitiesStore extends EntityStore<
  EntitiesState,
  DiffEntityResult
> {
  constructor() {
    super();
  }
}
