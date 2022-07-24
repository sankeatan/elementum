export interface Board {
    fire: Boolean;
    water: Boolean;
    earth: Boolean;
    electricity: Boolean;
    nether: Boolean;
}

export interface BoardState {
  board1: Board;
  board2: Board;
}

export function startBoard(): BoardState {
  return {
    board1: {
      fire: false,
      water: false,
      earth: false,
      electricity: false,
      nether: false,
    },
    board2: {
      fire: false,
      water: false,
      earth: false,
      electricity: false,
      nether: false,
    }
  }
}

export type PlayerName = 'board1' | 'board2'

export type ElementName = 'fire' | 'water' | 'earth' | 'electricity' | 'nether'
export const elementNames: ElementName[] = ['fire', 'water', 'earth', 'electricity', 'nether']

export type SlotName = 'attack1' | 'attack2' | 'defend'
export const slotNames: SlotName[] = ['attack1', 'attack2', 'defend']

export interface PlayerMove {
  'attack1': ElementName
  'attack2': ElementName
  'defend': ElementName
}

export class Game {}
