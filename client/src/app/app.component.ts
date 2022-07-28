import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { io, Socket } from 'socket.io-client'
import { elements, initElements } from './display/elements'
import { initCards, initCardSlots } from './display/cards'
import { CanvasEntity, CanvasEntityCollection, PolygonCanvasEntity, RectangleCanvasEntity } from './display/entities'
import { clamp } from './utility'
import { ElementCluster, PlayerAction, ElementName, PlayerSlot } from '../../../shared/shared'
import { environment } from 'src/environments/environment'

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

  private entityCollection: CanvasEntityCollection = new CanvasEntityCollection()

  private boardState: ElementCluster = new ElementCluster()

  private grabbedEntity: CanvasEntity = null
  private grabbedOffsetX: number = 0
  private grabbedOffsetY: number = 0

  public static readonly canvasWidth: number = 800
  public static readonly canvasHeight: number = 600

  public readonly player: PlayerSlot = ['player1', 'player2'][Math.random() < 0.5 ? 0 : 1] as PlayerSlot // stupid thing that we'll obviously replace
  public readonly playerAction: PlayerAction = new PlayerAction()

  public ngOnInit(): void {
    this.socket = io(environment.serverURL, environment.IoConnectionOptions)

    this.socket.on("connect_error", (err) => {
      console.error(err)
    })

    window.addEventListener('beforeunload', () => {
      this.socket.close()
    })
  }

  @HostListener('window:resize', ['$event'])
  private updateContextBounds() {
    this.contextBoundRight = this.gameCanvas.nativeElement.getBoundingClientRect().right
    this.contextBoundLeft = this.gameCanvas.nativeElement.getBoundingClientRect().left
    this.contextBoundTop = this.gameCanvas.nativeElement.getBoundingClientRect().top
    this.contextBoundBottom = this.gameCanvas.nativeElement.getBoundingClientRect().bottom
  }

  public ngAfterViewInit(): void {
    this.context = this.gameCanvas.nativeElement.getContext("2d")
    this.context.canvas.width = AppComponent.canvasWidth
    this.context.canvas.height = AppComponent.canvasHeight
    this.updateContextBounds()
    this.socket.on("gameUpdate", (update) => {
      this.boardState = update
      this.updateElements()
    })


    initElements(this.entityCollection)
    initCardSlots(this.entityCollection)
    initCards(this.entityCollection)
    this.reDraw()
  }

  private getCursorPosition(event: MouseEvent | TouchEvent) {
    const x = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - this.contextBoundLeft
    const y = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY) - this.contextBoundTop
    return {x: x, y: y}
  }

  private canvasClampX(input: number) {
    return clamp(input, 0, this.gameCanvas.nativeElement.width)
  }

  private canvasClampY(input: number) {
    return clamp(input, 0, this.gameCanvas.nativeElement.height)
  }
  
  public submitAction() {
    this.socket.emit("playCards", {'player': this.player, 'action': this.playerAction})
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('window:mousedown', ['$event'])
  mouseDown(event: MouseEvent | TouchEvent) {
    let cursorPosition = this.getCursorPosition(event)

    if(cursorPosition.x != this.canvasClampX(cursorPosition.x)
    || cursorPosition.y != this.canvasClampY(cursorPosition.y)) {
        return
    }

    let clickedEntity = this.entityCollection.getEntityAt(cursorPosition.x, cursorPosition.y, true)

    if(clickedEntity.draggable == false) {
      // TODO: play a bounce animation or something if you can't drag the entity
      return
    }

    this.grabbedEntity = clickedEntity

    if(this.grabbedEntity) {
      this.grabbedOffsetX = cursorPosition.x - this.grabbedEntity.x_pos
      this.grabbedOffsetY = cursorPosition.y - this.grabbedEntity.y_pos
      this.grabbedEntity.draw(this.context)
    }
  }

  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  @HostListener('window:mouseup', ['$event'])
  mouseUp(event: MouseEvent | TouchEvent) {
    if(this.grabbedEntity?.gamePieceType == "Card") {
      let cursorPosition = this.getCursorPosition(event)
      let entityBelow = this.entityCollection.getEntityBelow(cursorPosition.x, cursorPosition.y, this.grabbedEntity)
      if(entityBelow.gamePieceType == "Slot" && entityBelow.playerSlot == this.player && entityBelow.) {
        // TODO: put this card into the slot
        // TODO URGENT: just make CardSlotCanvasEntity, CardCanvasEntity, and ElementCanvasEntity classes and give them the appropriate properties
      }
    }

    // Let go of the draggable entity
    this.grabbedEntity = null
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  mouseMove(event: MouseEvent | TouchEvent): void {
    event.preventDefault()

    if(this.grabbedEntity == null) {
      return
    }

    let cursorPosition = this.getCursorPosition(event)
    this.grabbedEntity.x_pos = this.canvasClampX(cursorPosition.x - this.grabbedOffsetX)
    this.grabbedEntity.y_pos = this.canvasClampY(cursorPosition.y - this.grabbedOffsetY)

    this.reDraw()
  }

  reDraw(){
    this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height)
    this.elementCollection.draw(this.context)
    this.cardSlotCollection.draw(this.context)
    this.cardCollection.draw(this.context)
  }
  updateElements(){
    this.elementCollection.displayObjects.forEach(elem => {
      elem.toggle = this.boardState[elem["board"]][elem["name"]]
    })
    this.reDraw()
  }
}
