export interface SyncedNote {
  slug: string;
  name: string;
  path: string;
  title: string;
  updated: string;
  route: string;
}

export interface SyncedNoteFull extends SyncedNote {
  content: string;
}

export interface TrackNotesBundle {
  trackId: string;
  updated: string;
  notes: SyncedNoteFull[];
}
