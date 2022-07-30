export type CardType = ElementName | "wand" | "HIDDEN"
export type PlayerSlot = 'player1' | 'player2'
export type ElementName = 'fire' | 'water' | 'earth' | 'electricity' | 'nether'
export type ActionSlot = 'attack1' | 'attack2' | 'defend'

export class ElementCluster {
    public fire: boolean = false
    public water: boolean = false
    public earth: boolean = false
    public electricity: boolean = false
    public nether: boolean = false
}

export class PlayerAction {
  public attack1: CardType
  public attack2: CardType
  public defend: CardType
}
