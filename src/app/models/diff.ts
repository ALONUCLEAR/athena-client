// what is this? this is completly made up data to simulate the data from the aggregation service

export interface BaseEntityData {
  dataGroup: string;
  deleted?: boolean;
  [key: string]: any; // Allow for dynamic fields from generator
}

export interface WeeklyEntityData extends BaseEntityData {
  title: string;
  description: string;
  status: string;
  date: string;
  importance: string;
}

export interface EventAData extends BaseEntityData {
  title: string;
  priority: string;
  location: string;
  staffCount: number;
}

export interface EventBData extends BaseEntityData {
  title: string;
  category: string;
  impact: string;
  delay: string;
}

export type EntityData = WeeklyEntityData | EventAData | EventBData | BaseEntityData;

export interface DiffEntityResult {
  entityName: string;
  entityId: string;
  version: number;
  data: EntityData;
}

export interface SessionEvent {
  sessionId: string;
}

export interface ChunkPayload {
  entityName: string;
  version: number;
  chunkIndex: number;
  totalChunks: number;
  payloadFragment: string;
}
