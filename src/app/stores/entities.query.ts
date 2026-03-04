import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EntitiesStore, EntitiesState } from './entities.store';
import { DiffEntityResult } from '../models/diff';

@Injectable({ providedIn: 'root' })
export class EntitiesQuery extends QueryEntity<
  EntitiesState,
  DiffEntityResult
> {
  constructor(protected store: EntitiesStore) {
    super(store);
  }
}
