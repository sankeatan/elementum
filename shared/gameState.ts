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
