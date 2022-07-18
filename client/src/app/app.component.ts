import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { io, Socket } from 'socket.io-client'
import { elements, initElements } from './display/elements'
import { CanvasEntity, CanvasEntityCollection, PolygonCanvasEntity, RectangleCanvasEntity } from './display/display'
import { clamp } from './utility'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("game")
  private gameCanvas: ElementRef

  private context: CanvasRenderingContext2D
  private contextBoundRight: number = 0
  private contextBoundLeft: number = 0
  private contextBoundTop: number = 0
  private contextBoundBottom: number = 0

  private socket: Socket

  private collection: CanvasEntityCollection = new CanvasEntityCollection()

  private grabbedEntity: CanvasEntity = null
  private grabbedOffsetX: number = 0
  private grabbedOffsetY: number = 0

  public ngOnInit(): void {
    this.socket = io("http://localhost:3000", { transports: ['websocket', 'polling', 'flashsocket'] })
  }

  public ngAfterViewInit(): void {
    this.context = this.gameCanvas.nativeElement.getContext("2d")
    this.contextBoundRight = this.gameCanvas.nativeElement.getBoundingClientRect().right
    this.contextBoundLeft = this.gameCanvas.nativeElement.getBoundingClientRect().left
    this.contextBoundTop = this.gameCanvas.nativeElement.getBoundingClientRect().top
    this.contextBoundBottom = this.gameCanvas.nativeElement.getBoundingClientRect().bottom
    this.socket.on("position", (position: { x: number; y: number }): void => {
      console.log(position)
    })

    // drawBoard(this.gameCanvas)
    initElements(this.collection)
    this.collection.add(new RectangleCanvasEntity(60, 110, 100, 200))
    this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height)
    this.collection.draw(this.context)
  }

  private getCursorPosition(event: MouseEvent) {
    const x = event.clientX - this.contextBoundLeft
    const y = event.clientY - this.contextBoundTop
    return {x: x, y: y}
  }

  private canvasClampX(input: number) {
    return clamp(input, 0, this.gameCanvas.nativeElement.width)
  }

  private canvasClampY(input: number) {
    return clamp(input, 0, this.gameCanvas.nativeElement.height)
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
    let mousePosition = this.getCursorPosition(event)
    this.grabbedEntity = this.collection.getClicked(mousePosition.x, mousePosition.y, true)
    if(this.grabbedEntity) {
      this.grabbedOffsetX = mousePosition.x - this.grabbedEntity.x_pos
      this.grabbedOffsetY = mousePosition.y - this.grabbedEntity.y_pos
      this.grabbedEntity.draw(this.context)
    }
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

    this.grabbedEntity.x_pos = this.canvasClampX(event.clientX - this.contextBoundLeft - this.grabbedOffsetX)
    this.grabbedEntity.y_pos = this.canvasClampY(event.clientY - this.contextBoundTop - this.grabbedOffsetY)

    this.collection.draw(this.context)
  }
}
