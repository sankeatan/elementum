import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { io, Socket } from "socket.io-client"
import { elements, initElements } from "./display/elements"
import { DisplayObjectCollection, DisplayObjectPolygon, DisplayObjectRectangle } from "./display/display"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("game")
  private gameCanvas: ElementRef

  private context: CanvasRenderingContext2D
  private socket: Socket

  public ngOnInit(): void {
    this.socket = io("http://localhost:3000", { transports: ['websocket', 'polling', 'flashsocket'] })
  }

  private getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return {x: x, y: y}
  }

  public ngAfterViewInit(): void {
    this.context = this.gameCanvas.nativeElement.getContext("2d")
    this.socket.on("position", (position: { x: number; y: number }): void => {
      console.log(position)
    })

    // drawBoard(this.gameCanvas)
    let x = new DisplayObjectCollection()
    initElements(x)
    x.add(new DisplayObjectRectangle(60, 110, 100, 200))
    this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height)
    x.draw(this.context)

    this.gameCanvas.nativeElement.addEventListener("click", (event: MouseEvent) => {
      let pos = this.getCursorPosition(this.gameCanvas.nativeElement, event)
      let obj = x.getClicked(pos.x, pos.y, true)
      let color = obj ? obj.style['fillStyle'] : 'black'
      console.log("%c Shape clicked?", `background: ${color}`)
      this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      x.draw(this.context)
    })
  }

  public move(direction: string) {
    console.log(direction)
    this.socket.emit("move", direction)
  }

  public slots = ['attack1', 'attack2', 'defend']

  public cards = {
    "fire": {"slot": "hand"},
    "water": {"slot": "hand"},
    "lightning": {"slot": "hand"},
    "earth": {"slot": "hand"},
    "nether": {"slot": "hand"}
  }

  public placeCard(slot: string, name: string) {
    for(let card in this.cards) {
      if(this.cards[card].slot == slot) {
        this.cards[card].slot = 'hand'
        break
      }
    }

    if(name != 'none') {
      this.cards[name].slot = slot;
    }
    console.log(this.cards)
  }
}
