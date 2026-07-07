export interface CatalogNoteFile {
  name: string;
  path: string;
}

export interface CatalogUnit {
  id: string;
  path: string;
  hasReview: boolean;
}

export interface CatalogArtifact {
  type: string;
  route: string;
  title: string;
  description?: string;
}

export interface CatalogScheduleSummary {
  route: string;
  title: string;
  totalDays: number;
  subtitle?: string;
}

export interface CatalogTrack {
  id: string;
  depth: string;
  category: string;
  title: string;
  status: string;
  tags?: string[];
  started?: string;
  updated?: string;
  last_reviewed?: string;
  next_review?: string;
  mastery?: number;
  related?: string[];
  notes?: Array<{ path: string; title: string; mastery?: string }>;
  artifacts?: CatalogArtifact[];
  demos?: Array<{ title: string; route: string }>;
  noteFiles?: CatalogNoteFile[];
  units?: CatalogUnit[];
  unitCount?: number;
  noteCount?: number;
  schedule?: CatalogScheduleSummary | null;
}

export interface CatalogStats {
  total: number;
  byDepth: Record<string, number>;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface Catalog {
  version: number;
  updated: string;
  tags_index: Record<string, string[]>;
  depth_index: Record<string, string[]>;
  category_index: Record<string, string[]>;
  stats: CatalogStats;
  reviewReminders: CatalogTrack[];
  tracks: CatalogTrack[];
}
