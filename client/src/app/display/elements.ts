import { ElementRef } from '@angular/core'

export interface Element {
  stroke: string
  fill: string
  name: string
}

export const elements = [
{
  stroke: "orange",
  fill: "darkred",
  name: "fire",
},
{
  stroke: "aqua",
  fill: "darkblue",
  name: "water",
},
{
  stroke: "darkgreen",
  fill: "#776600",
  name: "earth",
},
{
  stroke: "blue",
  fill: "#dddd33",
  name: "electricity",
},
{
  stroke: "purple",
  fill: "#330033",
  name: "nether",
},
]

export function drawBoard(canvas: ElementRef<HTMLCanvasElement>) {
  let ctx = canvas.nativeElement.getContext("2d")!
  for(let i=0; i<elements.length; i++) {
    let element = elements[i]
    ctx.beginPath()
    let x = canvas.nativeElement.width/2+150*Math.cos(-Math.PI/2 + i*2*Math.PI/elements.length)
    let y = canvas.nativeElement.height/2+150*Math.sin(-Math.PI/2 + i*2*Math.PI/elements.length)
    console.log(`${x}, ${y}`)
    ctx.arc(x,y,75,0,2*Math.PI)
    ctx.strokeStyle = element.stroke
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.fillStyle = element.fill
    ctx.fill()
    console.log(i)
  }
}
