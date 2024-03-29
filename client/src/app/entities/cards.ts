import { Entity } from './entities'
import { CardType, ElementName, PlayerSlot } from '../../../../shared/shared'
import { RectangleCanvasRender } from '../canvas/render'
import { ElementumGame } from '../app.component'

export const cardProperties: {[key: string]: any} = {
  "fire": {
    elementType: "fire" as ElementName,
    style: {
      fillStyle: "red",
    }
  },
  "water": {
    elementType: "water" as ElementName,
    style: {
      fillStyle: "blue",
    }
  },
  "earth": {
    elementType: "earth" as ElementName,
    style: {
      fillStyle: "brown",
    }
  },
  "electricity": {
    elementType: "electricity" as ElementName,
    style: {
      fillStyle: "yellow",
    }
  },
  "nether": {
    elementType: "nether" as ElementName,
    style: {
      fillStyle: "purple",
    }
  },
  "wand": {
    elementType: undefined as ElementName,
    style: {
      fillStyle: "black",
    }
  },
  "HIDDEN": {
    elementType: undefined as ElementName,
    style: {
      fillStyle: "gray",
      strokeStyle: "red"
    }
  },
}

export class CardEntity extends Entity {
  public cardType: CardType
  public elementType: ElementName
  constructor(xPos: number, yPos:number, cardType: CardType, playerSlot: PlayerSlot) {
    let height = ElementumGame.canvasHeight * .225
    let width = height * .7159
    super(xPos, yPos, new RectangleCanvasRender(width, height, cardProperties[cardType].style))
    this.cardType = cardType
    this.playerSlot = playerSlot
    this.draggable = true
    this.elementType = cardProperties[cardType].elementType
  }
}
