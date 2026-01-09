export type Group = 'Green' | 'Red' | 'Blue';
export type EventType = 'Games' | 'Athletics';

export interface Result {
  id: string;
  studentName: string;
  registerNumber: string;
  group: Group;
  eventName: string;
  eventType: EventType;
  position: 1 | 2 | 3;
  points: number;
  timestamp: number;
  batchId?: string; // New field to group 1st, 2nd, 3rd places of the same event entry
}

export interface SportsEvent {
  id: string;
  name: string;
  type: EventType;
}

export interface LeaderboardEntry {
  group: Group;
  totalPoints: number;
  firstPlaceCount: number;
  secondPlaceCount: number;
  thirdPlaceCount: number;
}

export const GROUPS: Group[] = ['Green', 'Red', 'Blue'];
export const EVENT_TYPES: EventType[] = ['Games', 'Athletics'];

// Default points configuration
export const POINTS_MAP = {
  1: 10,
  2: 6,
  3: 2
};