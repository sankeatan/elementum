import { ElementRef } from '@angular/core'
import { bufferToggle } from 'rxjs'
import { AppComponent } from '../app.component'
import { CanvasEntity, CircleCanvasEntity, CanvasEntityCollection } from './entities'

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
  for(const params of [
    {name: "player1", x: AppComponent.canvasWidth * 3/4, y: AppComponent.canvasHeight * 3/4, rotation: 0},
    {name: "player2", x: AppComponent.canvasWidth * 3/4, y: AppComponent.canvasHeight * 1/4, rotation: Math.PI}
  ]) {
    let center_distance = AppComponent.canvasWidth * 1/8
    let element_radius = AppComponent.canvasWidth * 1/19
    for(const [i, element] of elements.entries()) {
      let x = center_distance*Math.cos(-Math.PI/2 + i*2*Math.PI/elements.length
        + params.rotation) + params.x

      let y = center_distance*Math.sin(-Math.PI/2 + i*2*Math.PI/elements.length
        + params.rotation) + params.y

      display.add(new CircleCanvasEntity(x, y, element_radius, {
        style: element.style,
        board: params.name,
        name: element.name,
        alternateColor: element.alternateColor
      }))
    }
  }
  
}
