import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
playerName: string;
colsInput: number;
rowsInput: number;

  constructor() { }

  ngOnInit() {
  }

  getPlayerName(player: string) {
    this.playerName = player;
    console.log('this is the player name: ', player);
  }

  getTheColsNumber(cols: number) {
    this.colsInput = cols;
    console.log('this is the cols input: ', cols);
  }

  getTheRowsNumber(rows: number) {
    this.rowsInput = rows;
    console.log('this is the rows input: ', rows);
  }
  
}
