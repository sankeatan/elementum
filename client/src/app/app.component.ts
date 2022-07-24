import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { io, Socket } from 'socket.io-client'
import { elements, initElements } from './display/elements'
import { CanvasEntity, CanvasEntityCollection, PolygonCanvasEntity, RectangleCanvasEntity } from './display/display'
import { clamp } from './utility'
import { GameState, PlayerMove, elementNames, ElementName, slotNames, SlotName, PlayerName } from '../../../shared/shared'

const config = {
  Environment: 'Prod',
  IoConnectionOptions: {
    reconnectionDelay: 100,
    reconnection: true,
    reconnectionAttemps: 2000,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false  }
}

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

  public readonly player: PlayerName = ['player1', 'player2'][Math.random() < 0.5 ? 0 : 1] as PlayerName // stupid thing that we'll obviously replace
  public readonly slotNames: SlotName[] = slotNames
  private playerSlots: PlayerMove = {'attack1': null, 'attack2': null, 'defend': null}

  public hand(): ElementName[] {
    // console.log(this.playerSlots)
    return elementNames.filter(el => !(Object.values(this.playerSlots).includes(el as ElementName)))
  }

  public handPlusSlot(slot: string) {
    let hand = this.hand()
    let slotElement = this.playerSlots[slot]
    if(slotElement) hand.push(slotElement)
    return hand
  }

  public ngOnInit(): void {
    switch(config.Environment) {
      case 'Local':
        this.socket = io("http://localhost:3000", config.IoConnectionOptions)
        break

      case 'Dev':
        console.error("Development server does not exist")
        break

      case 'Prod':
        this.socket = io("https://hogbod.dev", config.IoConnectionOptions)
        break

      default:
        console.error(`Invalid environment name: ${config.Environment}`)
    }

    this.socket.on("connect_error", (err) => {
      console.log(err)
    });

    window.addEventListener('beforeunload', () => {
      this.socket.close()
    });
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
    this.updateContextBounds()
    this.socket.on("gameUpdate", (update) =>{
      console.log(update);
    })

    // drawBoard(this.gameCanvas)
    initElements(this.collection)
    this.collection.add(new RectangleCanvasEntity(60, 110, 100, 200))
    this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height)
    this.collection.draw(this.context)
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

  public placeCard(slot: string, element: string) {
    if(!(elementNames.includes(element as ElementName))) {
      console.error(`Bad element name: ${element}`)
      return
    }

    if(!(this.hand().includes(element as ElementName))) {
      console.error(`Tried to place element not in hand: ${element}`)
      return
    }

    this.playerSlots[slot] = element
  }
  

  public playCards() {
    let move: PlayerMove = {
      attack1: this.playerSlots.attack1,
      attack2: this.playerSlots.attack2,
      defend: this.playerSlots.defend
    }

    this.socket.emit("playCards", {'player': this.player, 'move': move});
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event.code)
    // event.preventDefault() // use this to prevent default behavior for keys used for the game
    console.log(event)
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('window:mousedown', ['$event'])
  mouseDown(event: MouseEvent | TouchEvent) {
    let cursorPosition = this.getCursorPosition(event)

    if(cursorPosition.x != this.canvasClampX(cursorPosition.x)
    || cursorPosition.y != this.canvasClampY(cursorPosition.y)) {
        return
    }

    this.grabbedEntity = this.collection.getClicked(cursorPosition.x, cursorPosition.y, true)

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
    this.grabbedEntity = null
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  mouseMove(event: MouseEvent | TouchEvent): void {
    event.preventDefault()
    console.log("test")

    if(this.grabbedEntity == null) {
      return
    }

    let cursorPosition = this.getCursorPosition(event)
    this.grabbedEntity.x_pos = this.canvasClampX(cursorPosition.x - this.grabbedOffsetX)
    this.grabbedEntity.y_pos = this.canvasClampY(cursorPosition.y - this.grabbedOffsetY)

    this.collection.draw(this.context)
  }
}
