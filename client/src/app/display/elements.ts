import { ElementRef } from '@angular/core'
import { bufferToggle } from 'rxjs'
import { CanvasEntity, CircleCanvasEntity, CanvasEntityCollection } from './display'

export const elements: any = [
{
  style: {
    strokeStyle: "orange",
    fillStyle: "darkred"
  },
  name: "fire",
  alternateColor: "orange",
},
{
  style: {
    strokeStyle: "aqua",
    fillStyle: "darkblue"
  },
  name: "water",
  alternateColor: "aqua",
},
{
  style: {
    strokeStyle: "darkgreen",
    fillStyle: "#776600"
  },
  name: "earth",
  alternateColor: "darkgreen",
},
{
  style: {
    strokeStyle: "blue",
    fillStyle: "#dddd33"
  },
  name: "electricity",
  alternateColor: "blue",
},
{
  style: {
    strokeStyle: "purple",
    fillStyle: "#330033"
  },
  name: "nether",
  alternateColor: "purple",
},
]

export function initElements(display: CanvasEntityCollection) {
  for(let board of ["board1", "board2"]) {
    let yOffset = board == "board1" ? 0 : 200
    for(let i=0; i<elements.length; i++) {
      let element = elements[i]
      //todo: get x and y from canvas
      let x = 640/2+150*Math.cos(-Math.PI/2 + i*2*Math.PI/elements.length)
      let y = 480/2+150*Math.sin(-Math.PI/2 + i*2*Math.PI/elements.length) + yOffset
      display.add(new CircleCanvasEntity(x, y, 75, {style: elements[i].style, board: board, name: element.name, alternateColor: element.alternateColor}))
    }
  }
  
}
