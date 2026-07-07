export interface ScheduleResource {
  title: string;
  url: string;
  type?: string;
  required?: boolean;
}

export interface ScheduleTask {
  id: string;
  text: string;
  tags?: string[];
}

export interface ScheduleSelfTestItem {
  id: string;
  text: string;
  tags?: string[];
}

export interface ScheduleSelfTest {
  questions?: ScheduleSelfTestItem[];
  practical?: ScheduleSelfTestItem[];
}

export interface ScheduleDay {
  day: number;
  phase: string;
  title: string;
  duration: string;
  objectives?: string[];
  resources?: ScheduleResource[];
  tasks?: ScheduleTask[];
  selfTest?: ScheduleSelfTest;
}

export interface SchedulePhase {
  id: string;
  name: string;
  dayRange: [number, number];
  goal?: string;
}

export interface ReinforcementEntry {
  title: string;
  duration?: string;
  tasks: string[];
  resources?: ScheduleResource[];
}

export interface TrackSchedule {
  trackId: string;
  title: string;
  subtitle?: string;
  totalDays: number;
  hoursPerDay?: string;
  audience?: string;
  flexible?: boolean;
  phases: SchedulePhase[];
  tagLabels: Record<string, string>;
  reinforcementLibrary: Record<string, ReinforcementEntry>;
  days: ScheduleDay[];
}

export interface ScheduleSummary {
  route: string;
  title: string;
  totalDays: number;
  subtitle?: string;
}

export type SelfTestRating = 'ok' | 'weak' | 'skip';

export interface ScheduleProgress {
  focusDay: number;
  taskChecked: Record<string, boolean>;
  selfTestRating: Record<string, SelfTestRating>;
  dayCheckIns: Record<number, { date: string; note?: string }>;
}

export interface ReinforcementPlan {
  tag: string;
  label: string;
  entry: ReinforcementEntry;
  fromDays: number[];
  itemTexts: string[];
}
