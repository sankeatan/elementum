
export class ElementCluster {
    public fire: Boolean = false
    public water: Boolean = false
    public earth: Boolean = false
    public electricity: Boolean = false
    public nether: Boolean = false
}

export type PlayerSlot = 'player1' | 'player2'
export type ElementName = 'fire' | 'water' | 'earth' | 'electricity' | 'nether'
export type ActionSlot = 'attack1' | 'attack2' | 'defend'

export class PlayerAction {
  public attack1: ElementName = undefined
  public attack2: ElementName = undefined
  public defend: ElementName = undefined
}
