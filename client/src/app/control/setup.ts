import { ElementName, PlayerSlot } from "../../../../shared/shared"
import { AppComponent } from "../app.component"
import { CardEntity, cardProperties, CardType } from "../entities/cards"
import { CardSlotEntity } from "../entities/cardslots"
import { ElementEntity, elementProperties } from "../entities/elements"
import { EntityCollection } from "../entities/entities"

function fanCards(center_x: number, center_y:number, radius: number, start_angle: number, end_angle: number): CardEntity[] {
    let height = AppComponent.canvasHeight * .225
    let width = height * .7159
    let fanned_cards = []
    let angle_inc = (end_angle - start_angle) / (Object.keys(cardProperties).length-1)
    let angle = angle_inc
    for(const cardType of Object.keys(cardProperties)) {
      angle += angle_inc
      let x = center_x + radius * Math.cos(angle)
      let y = center_y - radius * Math.sin(angle)
      console.log(`(${Math.round(x-center_x)}, ${Math.round(y-center_y)}) ${Math.round(360*angle/(2*Math.PI))} sin: ${Math.sin(angle)}`)
      let entity = new CardEntity(x, y, cardType as CardType, AppComponent.player)
      entity.rotate(angle)
      fanned_cards.push(entity)
    }

    return fanned_cards
}
    
export function initCards(collection: EntityCollection) {
    let height = AppComponent.canvasHeight * .225
    let width = height * .7159

    // for(let card of fanCards(400, 300, 100, Math.PI * 1/2, Math.PI * 3/2)) {
    for(let card of fanCards(AppComponent.canvasWidth*.3, AppComponent.canvasHeight*1.09, 100, Math.PI * 1/3, Math.PI * 2/3)) {
        collection.add(card)
    }
}

export function initCardSlots(collection: EntityCollection) {
    let card_height = AppComponent.canvasHeight * .17
    let card_width = card_height * .7159
    let xstart = AppComponent.canvasWidth * .18
    let xpad = AppComponent.canvasWidth * 0.03
    let ypad = 60
    for(let i=0; i<3; i++) {
        let x_pos = xstart + (card_width + xpad) * i
        for(const offset_mult of [-1, 1]) {
            let y_pos = AppComponent.canvasHeight/2 + offset_mult * (card_height + ypad)/2
            let entity = new CardSlotEntity(x_pos, y_pos, i==0?"attack1":i==1?"attack2":"defend", offset_mult==1?"player1":"player2")
            collection.add(entity)
        }
    }
}

export function initElements(display: EntityCollection) {
    for(const params of [
      {name: "player1" as PlayerSlot, x: AppComponent.canvasWidth * 3/4, y: AppComponent.canvasHeight * 3/4, rotation: 0},
      {name: "player2" as PlayerSlot, x: AppComponent.canvasWidth * 3/4, y: AppComponent.canvasHeight * 1/4, rotation: Math.PI}
    ]) {
      let center_distance = AppComponent.canvasWidth * 1/8
      let element_radius = AppComponent.canvasWidth * 1/19
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
