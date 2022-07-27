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

function fanCards(center_x: number, center_y:number, radius: number, start_angle: number, end_angle: number): PolygonCanvasEntity[] {
  let height = AppComponent.canvasHeight * .225
  let width = height * .7159
  let fanned_cards = []
  let angle_inc = (end_angle - start_angle) / (cards.length-1)
  for(const [i, card] of cards.entries()) {
    let angle = start_angle + i * angle_inc
    let x = center_x + radius * Math.cos(angle)
    let y = center_y - radius * Math.sin(angle)
    console.log(`(${Math.round(x-center_x)}, ${Math.round(y-center_y)}) ${Math.round(360*angle/(2*Math.PI))} sin: ${Math.sin(angle)}`)
    let entity = new PolygonCanvasEntity(x, y, [
        [-height/2, -width/2],
        [-height/2, width/2],
        [height/2, width/2],
        [height/2, -width/2]
      ],
      {style: card}
    )
    entity.rotate(angle)
    fanned_cards.push(entity)
  }

  return fanned_cards
}

export function initCards(collection: CanvasEntityCollection) {
  let height = AppComponent.canvasHeight * .225
  let width = height * .7159
  for(const [i, card] of cards.entries()) {
    break
    let xpad = 240
    let ypad = 15
    let x = 400//xpad + (AppComponent.canvasWidth-2*xpad)*i/(cards.length-1)
    let y = 300//AppComponent.canvasHeight*.9 + Math.abs(i-cards.length/2+1) * 20 //AppComponent.canvasHeight + Math.pow(i-cards.length/2, 2) - 160
    console.log(y)
    let rot_increment = (Math.PI/4)
    let rotation_angle = i*rot_increment
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
    entity.rotate(Math.PI/4)
    collection.add(entity)
  }

  // for(let card of fanCards(400, 300, 100, Math.PI * 1/2, Math.PI * 3/2)) {
  for(let card of fanCards(AppComponent.canvasWidth*.3, AppComponent.canvasHeight*1.09, 100, Math.PI * 1/3, Math.PI * 2/3)) {
    collection.add(card)
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

  let x = new PolygonCanvasEntity(400, 150, [
      // [-40/2,-300/2],
      [40/2/2,-300/2],
      [40/2, 300/2],
      [-40/2, 300/2]
    ]
  )
  x.rotate(Math.PI/6)
  collection.add(x)
}
