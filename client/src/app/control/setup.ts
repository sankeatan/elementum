import { CardType, ElementName, PlayerSlot } from "../../../../shared/shared"
import { ElementumGame } from "../app.component"
import { CardEntity, cardProperties } from "../entities/cards"
import { CardSlotEntity } from "../entities/cardslots"
import { ElementEntity, elementProperties } from "../entities/elements"
import { EntityCollection } from "../entities/entities"

export function initCards(collection: EntityCollection): void {
  let center_x = .3 * ElementumGame.canvasWidth
  let center_y = 1.1 * ElementumGame.canvasHeight
  let radius = 0.1 * Math.sqrt(Math.pow(ElementumGame.canvasHeight,2) + Math.pow(ElementumGame.canvasWidth,2))
  let start_angle = Math.PI * 1/4
  let end_angle = -Math.PI * 1/4
  let angle_inc = (end_angle - start_angle) / (Object.keys(cardProperties).length-1)
  let angle = start_angle
  for(const cardType of Object.keys(cardProperties)) {
    let x = center_x + radius * Math.cos(angle+Math.PI/2)
    let y = center_y - radius * Math.sin(angle+Math.PI/2)
    let card = new CardEntity(x, y, cardType as CardType, ElementumGame.player)
    card.rotate(angle)
    collection.add(card)
    angle += angle_inc
  }
}

export function initCardSlots(collection: EntityCollection) {
  let card_height = ElementumGame.canvasHeight * .17
  let card_width = card_height * .7159
  let xstart = ElementumGame.canvasWidth * .18
  let xpad = ElementumGame.canvasWidth * 0.03
  let ypad = 60
  for(let i=0; i<3; i++) {
      let x_pos = xstart + (card_width + xpad) * i
      for(const offset_mult of [-1, 1]) {
          let y_pos = ElementumGame.canvasHeight/2 + offset_mult * (card_height + ypad)/2
          let entity = new CardSlotEntity(x_pos, y_pos, i==0?"attack1":i==1?"attack2":"defend", offset_mult==1?"player1":"player2")
          collection.add(entity)
      }
  }
}

export function initElements(display: EntityCollection) {
  for(const params of [
    {name: "player1" as PlayerSlot, x: ElementumGame.canvasWidth * 3/4, y: ElementumGame.canvasHeight * 3/4, rotation: 0},
    {name: "player2" as PlayerSlot, x: ElementumGame.canvasWidth * 3/4, y: ElementumGame.canvasHeight * 1/4, rotation: Math.PI}
  ]) {
    let center_distance = ElementumGame.canvasWidth * 1/8
    let element_radius = ElementumGame.canvasWidth * 1/19
    let angle_increment = 2*Math.PI/Object.keys(elementProperties).length
    let angle = 0
    for(const elementName of Object.keys(elementProperties)) {
      let x = center_distance*Math.cos(-Math.PI/2 + angle + params.rotation) + params.x
      let y = center_distance*Math.sin(-Math.PI/2 + angle + params.rotation) + params.y

      display.add(new ElementEntity(x, y, elementName as ElementName, params.name))

      angle += angle_increment
    }
  }
}
