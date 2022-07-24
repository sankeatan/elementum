import { RectangleCanvasEntity, CanvasEntityCollection } from './display'

export interface Card {
  strokeStyle: string
  fillStyle: string
  name: string
}

export const cards: Card[] = [
{
  strokeStyle: "orange",
  fillStyle: "darkred",
  name: "fire",
},
{
  strokeStyle: "aqua",
  fillStyle: "darkblue",
  name: "water",
},
{
  strokeStyle: "darkgreen",
  fillStyle: "#776600",
  name: "earth",
},
{
  strokeStyle: "blue",
  fillStyle: "#dddd33",
  name: "electricity",
},
{
  strokeStyle: "purple",
  fillStyle: "#330033",
  name: "nether",
},
]

export function initCards(display: CanvasEntityCollection) {
    for(let i=0; i<cards.length; i++) {
      let card = cards[i]
      //todo: get x and y from canvas
      let x = 300 + i*115
      let y = 600
      display.add(new RectangleCanvasEntity(x, y, 100, 200, {style: cards[i]}))
      console.log(`${x}, ${y}`)
      console.log(i)
    }
  }