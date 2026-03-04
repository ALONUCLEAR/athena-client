export interface DiffEntityResult {
  entityName: string;
  entityId: string;
  version: number;
  data: unknown;
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
