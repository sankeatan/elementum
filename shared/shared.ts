export interface Player {
    fire: Boolean;
    water: Boolean;
    earth: Boolean;
    electricity: Boolean;
    nether: Boolean;
}

export interface GameState {
  player1: Player;
  player2: Player;
}

export type PlayerName = 'player1' | 'player2'

export type ElementName = 'fire' | 'water' | 'earth' | 'electricity' | 'nether'
export const elementNames: ElementName[] = ['fire', 'water', 'earth', 'electricity', 'nether']

export type SlotName = 'attack1' | 'attack2' | 'defend'
export const slotNames: SlotName[] = ['attack1', 'attack2', 'defend']

export interface PlayerMove {
  'attack1': ElementName
  'attack2': ElementName
  'defend': ElementName
}
