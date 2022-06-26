import { NonNullAssert } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { elements } from './elements';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  elements = elements;
  constructor() { }

  ngOnInit(): void {
    let c = document.getElementById("myCanvas") as HTMLCanvasElement;
    let ctx = c.getContext("2d")!;
    for(let i=0; i<elements.length; i++) {
      let element = elements[i];
      ctx.beginPath();
      let x = 20+i*40;
      let y = 20+i*20;
      console.log(`${x}, ${y}`);
      ctx.arc(x,y,20,0,2*Math.PI);
      ctx.stroke();
      ctx.fillStyle = element.fill;
      ctx.fill();
      console.log(i);
    }
  }

  run(): void {
    
  }


}

class Client {
  /* accept user input, send actions to server, accept game state from server, update render */
}

class Server {
  /* validate and accept actions from client, update game state, send game state to client */
}

class Game {
  /* describes internal state of the game including menues, post game screens, etc */
}

function drawGame() {
  /* create html5 canvas render of game state */
  /* use buffer swapping to update render */
  /* https://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering */
}
