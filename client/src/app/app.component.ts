import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { Entity, EntityCollection } from './entities/entities'
import { clamp } from './utility'
import { ElementCluster, PlayerAction, ElementName, PlayerSlot } from '../../../shared/shared'
import { environment } from 'src/environments/environment'
import { initCards, initCardSlots, initElements } from './control/setup'
import { CardEntity } from './entities/cards'
import { CardSlotEntity } from './entities/cardslots'
import { ElementEntity } from './entities/elements'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class ElementumGame implements OnInit, AfterViewInit {
  @ViewChild("game")
  private gameCanvas: ElementRef

  private context: CanvasRenderingContext2D
  private contextBoundRight: number = 0
  private contextBoundLeft: number = 0
  private contextBoundTop: number = 0
  private contextBoundBottom: number = 0

  private socket: Socket

  private entityCollection: EntityCollection = new EntityCollection()

  private boardState: ElementCluster = new ElementCluster()

  private grabbedEntity: Entity = null
  private grabbedOffsetX: number = 0
  private grabbedOffsetY: number = 0

  public static readonly canvasWidth: number = 800
  public static readonly canvasHeight: number = 600

  private FPS: number = 60

  public static readonly player: PlayerSlot = ['player1', 'player2'][Math.random() < 0.5 ? 0 : 1] as PlayerSlot // stupid thing that we'll obviously replace
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
    this.context.canvas.width = ElementumGame.canvasWidth
    this.context.canvas.height = ElementumGame.canvasHeight
    this.updateContextBounds()
    this.socket.on("gameUpdate", (update) => {
      this.boardState = update
      this.updateElements()
    })

    initElements(this.entityCollection)
    initCardSlots(this.entityCollection)
    initCards(this.entityCollection)

    this.reDraw()
    setInterval(() => this.reDraw(), 1000/this.FPS)
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
    this.socket.emit("submitAction", {'player': ElementumGame.player, 'action': this.playerAction})
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

    let clickedEntity = this.entityCollection.getEntityAt(cursorPosition.x, cursorPosition.y)

    if(clickedEntity == undefined) {
      return
    }

    if(clickedEntity["playerSlot"] != ElementumGame.player) {
      // TODO: play a bounce animation or something if you can't drag the entity
      return
    }

    this.entityCollection.bringToFront(clickedEntity)
    this.grabbedOffsetX = cursorPosition.x - clickedEntity.x_pos
    this.grabbedOffsetY = cursorPosition.y - clickedEntity.y_pos
    this.grabbedEntity = clickedEntity

    // unsocket card from slot
    if(clickedEntity instanceof CardEntity) {
      let cardType = clickedEntity.cardType
      for(const key of Object.keys(this.playerAction)) {
        if(this.playerAction[key] == cardType) {
          this.playerAction[key] = undefined
          break
        }
      }
    }

    console.log(clickedEntity)
  }

  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  @HostListener('window:mouseup', ['$event'])
  mouseUp(event: MouseEvent | TouchEvent) {
    if(this.grabbedEntity instanceof CardEntity) {
      let card = this.grabbedEntity
      let entityBelow = this.entityCollection.getEntityBelow(card.x_pos, card.y_pos, this.grabbedEntity)
      if(entityBelow && entityBelow instanceof CardSlotEntity && entityBelow.playerSlot == ElementumGame.player) {
        let cardSlot = entityBelow as CardSlotEntity
        if(this.playerAction[cardSlot.actionSlot] == undefined) {
          this.playerAction[cardSlot.actionSlot] = card.cardType
          card.x_pos = cardSlot.x_pos
          card.y_pos = cardSlot.y_pos
        }
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
  }

  reDraw(): void {
    this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height)
    this.entityCollection.draw(this.context)
    this.context.strokeStyle = "black"
    this.context.lineTo(0, ElementumGame.canvasHeight/2)
    this.context.lineTo(ElementumGame.canvasWidth, ElementumGame.canvasHeight/2)
  }

  updateElements(): void {
    this.entityCollection.entities.forEach(entity => {
      if(entity instanceof ElementEntity) {
        let element = entity as ElementEntity
        element.activated = this.boardState[element.playerSlot][element.elementName]
      }
    })
  }
}
