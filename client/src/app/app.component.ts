import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import io from "socket.io-client";
import { elements, drawBoard } from "./display/elements"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild("game")
  private gameCanvas!: ElementRef;

  private context: any;
  private socket: any;

  public ngOnInit(): void {
    this.socket = io("http://localhost:3000", { transports : ['websocket'] });
  }

  public ngAfterViewInit(): void {
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    this.socket.on("position", (position: { x: number; y: number; }): void => {
      console.log(position);
      // this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.context.fillRect(position.x, position.y, 20, 20);
    })

    drawBoard(this.gameCanvas);
  }

  public move(direction: string) {
    console.log(direction);
    this.socket.emit("move", direction);
  }
}
