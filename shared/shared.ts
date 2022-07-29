export type CardType = ElementName | "wand" | "HIDDEN"
export type PlayerSlot = 'player1' | 'player2'
export type ElementName = 'fire' | 'water' | 'earth' | 'electricity' | 'nether'
export type ActionSlot = 'attack1' | 'attack2' | 'defend'

export class ElementCluster {
    public fire: Boolean = false
    public water: Boolean = false
    public earth: Boolean = false
    public electricity: Boolean = false
    public nether: Boolean = false
}

export class PlayerAction {
  public attack1: CardType
  public attack2: CardType
  public defend: CardType
}
