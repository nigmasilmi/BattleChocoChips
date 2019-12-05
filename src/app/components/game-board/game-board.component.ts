import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { FleetPlacingService } from 'src/app/services/fleet-placing.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  permissionToRender: boolean;
  iGoWithA: boolean;
  iGoWithB: boolean;
  playerName: string;
  colsInput: number;
  rowsInput: number;
  playerIsSet = false;
  boardsPredefined: any;
  availableList: any;

  constructor(public fleetPlacingS: FleetPlacingService) {
    this.boardsPredefined = this.fleetPlacingS.getPredefinedBoards();
    this.fleetPlacingS.bringTheAvailables().subscribe(whatComes => {
      this.availableList = whatComes;
      this.permissionToRender = true;

    });
  }

  ngOnInit() {
    console.log('boardsPredefined: ', this.boardsPredefined);
  }

  // fuction to select the player and display player options
  goWithA() {
    this.iGoWithB = false;
    this.iGoWithA = true;
  }

  goWithB() {
    this.iGoWithB = true;
    this.iGoWithA = false;
  }


  // get inputs to validate them -- Player A -- check if later on this functionality must be moved or not
  get playerNameInput() {
    return this.fleetPlacingS.preferencesForm.get('playerName');
  }

  get colsNumber() {
    return this.fleetPlacingS.preferencesForm.get('colsInput');
  }

  get rowsNumber() {
    return this.fleetPlacingS.preferencesForm.get('rowsInput');
  }

  showTheBoardsOption() {
    return this.fleetPlacingS.getPredefinedBoards();

  }

  onSubmit() {
    const playerNameToPass = this.fleetPlacingS.preferencesForm.value.playerName;
    let rowsInputToPass: number;
    let colsInputToPass: number;
    const boardSelected = this.fleetPlacingS.preferencesForm.value.boardType;
    switch (boardSelected) {
      case '5x5':
        rowsInputToPass = 5;
        colsInputToPass = 5;
        break;
      case '7x7':
        rowsInputToPass = 7;
        colsInputToPass = 7;
        break;

      case '10x10':
        rowsInputToPass = 10;
        colsInputToPass = 10;
        break;
    }
    console.log('boardSelected: ', boardSelected);
    this.fleetPlacingS.createBoard(rowsInputToPass, colsInputToPass, playerNameToPass);
    this.fleetPlacingS.actualPlayer = this.fleetPlacingS.preferencesForm.value.playerName;
    this.playerIsSet = true;
    this.fleetPlacingS.preferencesForm.reset();
  }


}
