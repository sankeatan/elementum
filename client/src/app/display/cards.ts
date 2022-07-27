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
}
]

export function initCards(collection: CanvasEntityCollection) {
  for(const [i, card] of cards.entries()) {
    let xpad = 160
    let ypad = 15
    let x = xpad + (AppComponent.canvasWidth-2*xpad)*i/(cards.length-1)
    let y = Math.abs(i-cards.length/2+1) * 20 //AppComponent.canvasHeight + Math.pow(i-cards.length/2, 2) - 160
    console.log(y)
    let height = AppComponent.canvasHeight * .225
    let width = height * .7159
    let rot_increment = (Math.PI/4)/(cards.length)
    let rotation_angle = i*rot_increment - rot_increment*(cards.length-1)/2
    // TODO: give rotation functionality to RectangleCanvasEntity and use that instead?
    // another option: get rid of RectangleCanvasEntity and just add a rectangle constructor to PolygonCanvasEntity
    let entity = new PolygonCanvasEntity(x, y, [
        [-width/2,-height/2],
        [width/2,-height/2],
        [width/2, height/2],
        [-width/2, height/2]
      ],
      {style: card}
    )
    entity.rotate(rotation_angle)
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
