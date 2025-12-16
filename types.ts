
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum CellType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  START = 'START',
  GOAL = 'GOAL',
  COIN = 'COIN',
  OBSTACLE = 'OBSTACLE'
}

export interface Position {
  x: number;
  y: number;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  objective: string;
  pythonConcept: string;
  gridSize: number;
  layout: CellType[][]; // [y][x]
  startPos: Position;
  initialCode: string;
  tutorialText: string;
  timeLimit: number; // in seconds
}

export interface LogEntry {
  type: 'info' | 'error' | 'success' | 'ai';
  message: string;
}

export type ActionType = 'move_up' | 'move_down' | 'move_left' | 'move_right' | 'collect';

export interface GameAction {
  type: ActionType;
  lineNo?: number;
}

// Student Data Types
export interface StudentStat {
  studentId: string;
  name: string;
  class: string;
  levelId: number;
  status: 'Completed' | 'Failed' | 'In Progress';
  attempts: number;
  timeSpent: number; // seconds
  lastPlayed: string;
}

export interface StudentSession {
  studentClass: string;
  classNumber: string;
  characterId?: string; // Add character selection
}

export enum AppScreen {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  CHARACTER_SELECT = 'CHARACTER_SELECT', // New Screen
  MAP = 'MAP',
  GAME = 'GAME',
  TEACHER = 'TEACHER'
}

export interface CharacterConfig {
    id: string;
    name: string;
    imageUrl: string;
    scale?: number; // Adjust image size if needed
}
