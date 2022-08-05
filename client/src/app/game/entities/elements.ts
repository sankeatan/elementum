import { ElementName, PlayerSlot } from '../../../../../shared/shared'
import { CanvasRender, CircleCanvasRender } from '../canvas/render'
import { Entity } from './entities'

export const elementProperties: {[key: string]: any} = {
  "fire": {
    style: {
      strokeStyle: "orange",
      fillStyle: "darkred"
    },
    alternateColor: "orange",
  },
  "water": {
    style: {
      strokeStyle: "aqua",
      fillStyle: "darkblue"
    },
    alternateColor: "aqua",
  },
  "earth": {
    style: {
      strokeStyle: "darkgreen",
      fillStyle: "#776600"
    },
    alternateColor: "darkgreen",
  },
  "electricity": {
    style: {
      strokeStyle: "blue",
      fillStyle: "#dddd33"
    },
    alternateColor: "blue",
  },
  "nether": {
    style: {
      strokeStyle: "purple",
      fillStyle: "#330033"
    },
    alternateColor: "purple"
  },
}

export class ElementEntity extends Entity {
  public activated: boolean = false
  public activatedRender: CircleCanvasRender
  public elementName: ElementName

  constructor(xPos: number, yPos:number, elementName: ElementName, playerSlot: PlayerSlot) {
    let properties = elementProperties[elementName]
    super(xPos, yPos, new CircleCanvasRender(40, properties.style))
    this.elementName = elementName
    this.playerSlot = playerSlot
    this.activatedRender = new CircleCanvasRender(40, {...properties.style, fillStyle: properties.alternateColor})
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    if(this.activated) {
      this.activatedRender.draw(ctx, this.xPos, this.yPos)
    }
    else {
      super.draw(ctx)
    }
  }
}
