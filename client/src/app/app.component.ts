import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { io, Socket } from "socket.io-client"
import { elements, drawBoard } from "./display/elements"

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
  }

  public ngAfterViewInit(): void {
    this.context = this.gameCanvas.nativeElement.getContext("2d")
    this.socket.on("position", (position: { x: number; y: number }): void => {
      console.log(position)
      // this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height)
      this.context.fillStyle = "black"
      this.context.fillRect(position.x, position.y, 20, 20)
    })

    drawBoard(this.gameCanvas)

    this.gameCanvas.nativeElement.addEventListener("click", (event: MouseEvent) => {
      this.getCursorPosition(this.gameCanvas.nativeElement, event)
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

  public takeCard(slot: string, name: string) {
    for(let card in this.cards) {
      if(this.cards[card].slot == slot) {
        this.cards[card].slot = 'hand'
        break
      }
    }

    this.cards[name].slot = slot;
    console.log(this.cards)
  }
}
