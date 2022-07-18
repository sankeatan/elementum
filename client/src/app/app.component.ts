import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { io, Socket } from 'socket.io-client'
import { elements, initElements } from './display/elements'
import { CanvasEntity, CanvasEntityCollection, PolygonCanvasEntity, RectangleCanvasEntity } from './display/display'

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

  private collection: CanvasEntityCollection = new CanvasEntityCollection()

  private grabbedEntity: CanvasEntity = null

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
    initElements(this.collection)
    this.collection.add(new RectangleCanvasEntity(60, 110, 100, 200))
    this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height)
    this.collection.draw(this.context)

    this.gameCanvas.nativeElement.addEventListener("click", (event: MouseEvent) => {
      // let pos = this.getCursorPosition(this.gameCanvas.nativeElement, event)
      // let obj = this.collection.getClicked(pos.x, pos.y, true)
      // let color = obj ? obj.style['fillStyle'] : 'black'
      // console.log("%c Shape clicked?", `background: ${color}`)
      // this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      // this.collection.draw(this.context)
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

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event.code)
    // event.preventDefault() // use this to prevent default behavior for keys used for the game
    console.log(event)
  }

  @HostListener('window:mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    this.grabbedEntity = this.collection.getClicked(event.clientX-this.gameCanvas.nativeElement.getBoundingClientRect().left, event.clientY-this.gameCanvas.nativeElement.getBoundingClientRect().top)
  }

  @HostListener('window:mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    this.grabbedEntity = null
  }

  @HostListener('window:mousemove', ['$event'])
  mouseMove(event: MouseEvent): void {
    if(this.grabbedEntity == null) {
      return
    }
    let rightBound = this.gameCanvas.nativeElement.getBoundingClientRect().right
    let leftBound = this.gameCanvas.nativeElement.getBoundingClientRect().left
    let topBound = this.gameCanvas.nativeElement.getBoundingClientRect().top
    let bottomBound = this.gameCanvas.nativeElement.getBoundingClientRect().bottom
    const x = event.clientX - leftBound
    const y = event.clientY - topBound
    let redraw: boolean = false
    if(event.clientX >= leftBound && event.clientX <= rightBound) {
      this.grabbedEntity.x_pos = event.clientX - leftBound
      redraw = true
    }
    if(event.clientY >= topBound && event.clientY <= bottomBound) {
      this.grabbedEntity.y_pos = event.clientY - topBound
      redraw = true
    }
    if(redraw) {
      this.collection.draw(this.context)
    }
  }
}
