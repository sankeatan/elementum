import { AppComponent } from '../app.component'
import { Entity } from './entities'
import { ElementName, PlayerSlot } from '../../../../shared/shared'
import { RectangleCanvasRender } from '../canvas/render'

export type CardType = ElementName | "wand" | "HIDDEN"

export const cardProperties: {[key: string]: any} = {
  "fire": {
    style: {
      fillStyle: "red",
    }
  },
  "water": {
    style: {
      fillStyle: "blue",
    }
  },
  "earth": {
    style: {
      fillStyle: "brown",
    }
  },
  "electricity": {
    style: {
      fillStyle: "yellow",
    }
  },
  "nether": {
    style: {
      fillStyle: "purple",
    }
  },
  "wand": {
    style: {
      fillStyle: "black",
    }
  },
  "HIDDEN": {
    style: {
      fillStyle: "gray",
      strokeStyle: "red"
    }
  },
}

export class CardEntity extends Entity {
  public cardType: CardType
  public playerSlot: PlayerSlot
  constructor(x_pos: number, y_pos:number, cardType: CardType, playerSlot: PlayerSlot) {
    super(x_pos, y_pos, new RectangleCanvasRender(60, 90, cardProperties[cardType].style))
    this.cardType = cardType
    this.playerSlot = playerSlot
  }
}
