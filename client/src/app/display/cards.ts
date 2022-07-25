import { AppComponent } from '../app.component'
import { RectangleCanvasEntity, CanvasEntityCollection, PolygonCanvasEntity } from './display'

export interface Card {
  strokeStyle: string
  fillStyle: string
  name: string
}

export const cards: Card[] = [
{
  strokeStyle: "black",
  fillStyle: "brown",
  name: "fire",
},
{
  strokeStyle: "black",
  fillStyle: "brown",
  name: "water",
},
{
  strokeStyle: "black",
  fillStyle: "brown",
  name: "earth",
},
{
  strokeStyle: "black",
  fillStyle: "brown",
  name: "electricity",
},
{
  strokeStyle: "black",
  fillStyle: "brown",
  name: "nether",
},
]

export function initCards(collection: CanvasEntityCollection) {
  for(let i=0; i<cards.length; i++) {
    let card = cards[i]
    // TODO: get x and y from canvas
    let xpad = 160
    let ypad = 15
    let x = xpad + (AppComponent.canvasWidth-2*xpad)*i/(cards.length-1)
    let y = -40 + AppComponent.canvasHeight - ypad*(cards.length-1)/2 + Math.abs(i*ypad-((cards.length-1)*ypad)/2)
    let height = 150
    let width = 100
    let rot_increment = Math.PI/16
    let rotation = {angle: i*rot_increment - (rot_increment*cards.length/2), anchor_x: 0, anchor_y: 0}
    let entity = new PolygonCanvasEntity(x, y, [
      [-width/2,-height/2],
      [width/2,-height/2],
      [width/2, height/2],
      [-width/2, height/2]
    ], {style: cards[i]
    })
    entity.rotate(rotation)
    collection.add(entity)
  }
}

export function initCardSlots(collection: CanvasEntityCollection) {
  let card_height = 90
  let card_width = 60
  let gutter_width = 220
  let vertical_separation = 30
  for(let i=0; i<3; i++) {
    let x_pos = gutter_width + i*(AppComponent.canvasWidth-2*gutter_width)/2
    for(const offset_mult of [-1, 1]) {
      let y_pos = (AppComponent.canvasHeight + offset_mult * (card_height + vertical_separation))/2
      let entity = new RectangleCanvasEntity(x_pos, y_pos, card_width, card_height, {style: {fillStyle: "gray"}})
      collection.add(entity)
    }
  }
}
