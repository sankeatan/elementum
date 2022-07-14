import { ElementRef } from '@angular/core'
import { DisplayObject, DisplayObjectCircle, GameDisplay } from './display'

export interface Element {
  strokeStyle: string
  fillStyle: string
  name: string
}

export const elements = [
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

export function initElements(display: GameDisplay) {
  for(let i=0; i<elements.length; i++) {
    let element = elements[i]
    let x = 640/2+150*Math.cos(-Math.PI/2 + i*2*Math.PI/elements.length)
    let y = 480/2+150*Math.sin(-Math.PI/2 + i*2*Math.PI/elements.length)
    display.add(new DisplayObjectCircle(x, y, 50, elements[i]))
    console.log(`${x}, ${y}`)
    console.log(i)
  }
}
