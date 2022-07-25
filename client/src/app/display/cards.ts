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

export function initCards(display: CanvasEntityCollection) {
  for(let i=0; i<cards.length+50; i++) {
    let card = cards[i%cards.length]
    // TODO: get x and y from canvas
    let xpad = 160
    let ypad = 15
    let x = 450//xpad + (AppComponent.canvasWidth-2*xpad)*i/(cards.length-1)
    let y = 450//-40 + AppComponent.canvasHeight - ypad*(cards.length-1)/2 + Math.abs(i*ypad-((cards.length-1)*ypad)/2)
    let height = 150
    let width = 100
    let rot_increment = Math.PI/16
    let rotation = {angle: i*rot_increment - (rot_increment*cards.length/2), anchor_x: -height, anchor_y: width}
    let entity = new PolygonCanvasEntity(x, y, [
      [-width/2,-height/2],
      [width/2,-height/2],
      [width/2, height/2],
      [-width/2, height/2]
    ], {style: cards[i]
    })
    entity.rotate(rotation)
    display.add(entity)
  }
}