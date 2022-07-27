import { ElementRef } from '@angular/core'
import { bufferToggle } from 'rxjs'
import { AppComponent } from '../app.component'
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
    alternateColor: "purple"
  },
]

export function initElements(display: CanvasEntityCollection) {
  for(let board of ["board1", "board2"]) {
    let yOffset = board == "board1" ? 0 : 400
    for(const [i, element] of elements.entries()) {
      let x = AppComponent.canvasWidth/2+100*Math.cos(-Math.PI/2 + i*2*Math.PI/elements.length
        + (board=='board1'?Math.PI:0))

      let y = AppComponent.canvasHeight/4+100*Math.sin(-Math.PI/2 + i*2*Math.PI/elements.length
        + (board=='board1'?Math.PI:0)) + yOffset

      display.add(new CircleCanvasEntity(x, y, 50, {
        style: element.style,
        board: board,
        name: element.name,
        alternateColor: element.alternateColor
      }))
    }
  }
  
}
