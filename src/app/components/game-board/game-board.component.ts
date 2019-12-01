import { Component, OnInit } from '@angular/core';
import { FleetPlacingService } from 'src/app/services/fleet-placing.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  playerName: string;
  colsInput: number;
  rowsInput: number;
  playerIsSet = false;

  constructor(private fleetPlacingS: FleetPlacingService) { }

  ngOnInit() {
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
