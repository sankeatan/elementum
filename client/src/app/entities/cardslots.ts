import { Entity } from './entities'
import { RectangleCanvasRender } from '../canvas/render'
import { ActionSlot, PlayerSlot } from '../../../../shared/shared'

export const cardProperties: {[key: string]: any} = {
  "attack1": {
    style: {
      fillStyle: "red",
    }
  },
  "attack2": {
    style: {
      fillStyle: "red",
    }
  },
  "defend": {
    style: {
      fillStyle: "blue",
    }
  },
}

export class CardSlotEntity extends Entity {
  public actionSlot: ActionSlot
  public playerSlot: PlayerSlot
  constructor(x_pos: number, y_pos:number, actionSlot: ActionSlot, playerSlot: PlayerSlot) {
    super(x_pos, y_pos, new RectangleCanvasRender(80, 120, cardProperties[actionSlot].style))
    this.actionSlot = actionSlot
    this.playerSlot = playerSlot
  }
}
