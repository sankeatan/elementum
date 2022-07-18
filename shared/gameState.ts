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

export const game: GameState = {
  player1: {
    fire: false,
    water: false,
    earth: false,
    electricity: false,
    nether: false,
  },
  player2: {
    fire: false,
    water: false,
    earth: false,
    electricity: false,
    nether: false,
  }
}