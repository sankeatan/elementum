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
  }

}
