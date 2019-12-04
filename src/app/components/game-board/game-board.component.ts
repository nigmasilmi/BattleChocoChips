import { Component, OnInit } from '@angular/core';
import { FleetPlacingService } from 'src/app/services/fleet-placing.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  iGoWithA = true;
  iGoWithB = true;
  playerName: string;
  colsInput: number;
  rowsInput: number;
  playerIsSet = false;

  constructor(public fleetPlacingS: FleetPlacingService) {
    this.fleetPlacingS.pushBoardsCollection();
   }

  ngOnInit() {
  }

  // fuction to select the player and display player options
  goWithA() {
    this.iGoWithB = false;
  }

  goWithB() {
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


  onSubmit() {
    const playerNameToPass = this.fleetPlacingS.preferencesForm.value.playerName;
    const rowsInputToPass = this.fleetPlacingS.preferencesForm.value.rowsInput;
    const colsInputToPass = this.fleetPlacingS.preferencesForm.value.colsInput;
    this.fleetPlacingS.createBoard(rowsInputToPass, colsInputToPass, playerNameToPass);
    this.fleetPlacingS.actualPlayer = this.fleetPlacingS.preferencesForm.value.playerName;
    this.playerIsSet = true;
    this.fleetPlacingS.preferencesForm.reset();
  }

}
